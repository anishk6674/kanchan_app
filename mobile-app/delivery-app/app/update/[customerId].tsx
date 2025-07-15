import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Text,
  Surface,
  Divider,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { apiService, Customer } from '../../src/services/api';

export default function DailyUpdateScreen() {
  const { customerId } = useLocalSearchParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [delivered, setDelivered] = useState('');
  const [collected, setCollected] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (customerId) {
      loadCustomerAndStatus();
    }
  }, [customerId]);

  const loadCustomerAndStatus = async () => {
    try {
      setLoadingStatus(true);
      
      // Load customer details
      const customers = await apiService.getCustomers();
      const customerData = customers.find(c => c.customer_id === customerId);
      
      if (!customerData) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Customer not found',
        });
        router.back();
        return;
      }
      
      setCustomer(customerData);

      // Load current status
      const dailyUpdates = await apiService.getDailyUpdates(today);
      const status = dailyUpdates.find(update => update.customer_id === customerId);
      
      if (status) {
        setCurrentStatus(status);
        setDelivered(status.delivered_qty.toString());
        setCollected(status.collected_qty.toString());
        setNotes(status.notes || '');
      } else {
        // Set default values for new entry
        setDelivered(customerData.can_qty?.toString() || '0');
        setCollected('0');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load customer data',
      });
      // Set defaults if can't load
      setDelivered('0');
      setCollected('0');
    } finally {
      setLoadingStatus(false);
    }
  };

  const calculateHoldingStatus = () => {
    const deliveredQty = parseInt(delivered) || 0;
    const collectedQty = parseInt(collected) || 0;
    const previousHolding = currentStatus?.holding_status || 0;

    // If this is an existing update, calculate from current values
    if (currentStatus) {
      return deliveredQty - collectedQty + (previousHolding - currentStatus.delivered_qty + currentStatus.collected_qty);
    }

    // For new updates, calculate from delivered - collected
    return deliveredQty - collectedQty;
  };

  const handleSave = async () => {
    const deliveredQty = parseInt(delivered) || 0;
    const collectedQty = parseInt(collected) || 0;

    if (deliveredQty < 0 || collectedQty < 0) {
      Alert.alert('Invalid Input', 'Quantities cannot be negative');
      return;
    }

    if (collectedQty > deliveredQty + (currentStatus?.holding_status || 0)) {
      Alert.alert(
        'Invalid Input',
        'Collected quantity cannot exceed available cans'
      );
      return;
    }

    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const updateData = {
        customer_id: customerId!,
        date: today,
        delivered_qty: deliveredQty,
        collected_qty: collectedQty,
        notes: notes.trim(),
      };

      await apiService.saveDailyUpdate(updateData);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Updated status for ${customer?.name}`,
      });

      router.back();
    } catch (error) {
      console.error('Error saving update:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save update. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'shop': return ['#1e40af', '#3b82f6'];
      case 'monthly': return ['#059669', '#10b981'];
      case 'order': return ['#7c3aed', '#a855f7'];
      default: return ['#64748b', '#94a3b8'];
    }
  };

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'shop': return 'storefront';
      case 'monthly': return 'calendar';
      case 'order': return 'cart';
      default: return 'person';
    }
  };

  if (loadingStatus) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Loading customer status...</Text>
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Customer not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        {/* Customer Info Card */}
        <LinearGradient
          colors={getCustomerTypeColor(customer.customer_type)}
          style={styles.customerGradient}
        >
          <Card style={styles.customerCard}>
            <Card.Content>
              <View style={styles.customerHeader}>
                <View style={styles.customerInfo}>
                  <Title style={styles.customerName}>{customer.name}</Title>
                  <Paragraph style={styles.customerPhone}>{customer.phone_number}</Paragraph>
                  <Paragraph style={styles.customerAddress} numberOfLines={2}>
                    {customer.address}
                  </Paragraph>
                </View>
                <Surface style={styles.iconContainer}>
                  <Ionicons
                    name={getCustomerTypeIcon(customer.customer_type) as any}
                    size={32}
                    color={getCustomerTypeColor(customer.customer_type)[0]}
                  />
                </Surface>
              </View>

              <View style={styles.customerMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Type</Text>
                  <Chip 
                    style={[styles.typeChip, { backgroundColor: getCustomerTypeColor(customer.customer_type)[0] }]}
                    textStyle={styles.chipText}
                  >
                    {customer.customer_type.toUpperCase()}
                  </Chip>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Default Cans</Text>
                  <Text style={styles.metaValue}>{customer.can_qty || 0}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Date</Text>
                  <Text style={styles.metaValue}>{new Date().toLocaleDateString('en-IN')}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </LinearGradient>

        {/* Current Status Card */}
        {currentStatus && (
          <Card style={styles.statusCard}>
            <Card.Content>
              <Title style={styles.statusTitle}>Current Status</Title>
              <View style={styles.statusGrid}>
                <LinearGradient colors={['#1e40af', '#3b82f6']} style={styles.statusItemGradient}>
                  <View style={styles.statusItem}>
                    <Ionicons name="car" size={24} color="white" />
                    <Text style={styles.statusValue}>{currentStatus.delivered_qty}</Text>
                    <Text style={styles.statusLabel}>Delivered</Text>
                  </View>
                </LinearGradient>
                <LinearGradient colors={['#059669', '#10b981']} style={styles.statusItemGradient}>
                  <View style={styles.statusItem}>
                    <Ionicons name="return-up-back" size={24} color="white" />
                    <Text style={styles.statusValue}>{currentStatus.collected_qty}</Text>
                    <Text style={styles.statusLabel}>Collected</Text>
                  </View>
                </LinearGradient>
                <LinearGradient colors={['#dc2626', '#ef4444']} style={styles.statusItemGradient}>
                  <View style={styles.statusItem}>
                    <Ionicons name="archive" size={24} color="white" />
                    <Text style={styles.statusValue}>{currentStatus.holding_status}</Text>
                    <Text style={styles.statusLabel}>Holding</Text>
                  </View>
                </LinearGradient>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Update Form Card */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.formTitle}>Update Daily Status</Title>
            <Divider style={styles.divider} />

            <View style={styles.inputContainer}>
              <TextInput
                label="Delivered Quantity"
                value={delivered}
                onChangeText={setDelivered}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon={() => <Ionicons name="car" size={20} color="#1e40af" />} />}
                theme={{ colors: { primary: '#1e40af' } }}
              />

              <TextInput
                label="Collected Quantity"
                value={collected}
                onChangeText={setCollected}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon={() => <Ionicons name="return-up-back" size={20} color="#059669" />} />}
                theme={{ colors: { primary: '#059669' } }}
              />

              <TextInput
                label="Notes (Optional)"
                value={notes}
                onChangeText={setNotes}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                left={<TextInput.Icon icon={() => <Ionicons name="document-text" size={20} color="#7c3aed" />} />}
                theme={{ colors: { primary: '#7c3aed' } }}
              />
            </View>

            {/* Calculated Holding Status */}
            <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.calculationGradient}>
              <Surface style={styles.calculationCard}>
                <View style={styles.calculationHeader}>
                  <Ionicons name="calculator" size={20} color="white" />
                  <Text style={styles.calculationTitle}>Calculated Holding Status</Text>
                </View>
                <Text style={styles.calculationValue}>{calculateHoldingStatus()} cans</Text>
                <Text style={styles.calculationNote}>
                  This will be the new holding status after update
                </Text>
              </Surface>
            </LinearGradient>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.cancelButton}
                textColor="#64748b"
              >
                Cancel
              </Button>
              <LinearGradient colors={['#1e40af', '#3b82f6']} style={styles.saveButtonGradient}>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={loading}
                  disabled={loading}
                  style={styles.saveButton}
                  buttonColor="transparent"
                  textColor="white"
                >
                  {loading ? 'Saving...' : 'Save Update'}
                </Button>
              </LinearGradient>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 16,
  },
  customerGradient: {
    margin: 16,
    borderRadius: 16,
  },
  customerCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 0,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  customerPhone: {
    color: '#64748b',
    fontSize: 15,
    marginBottom: 4,
  },
  customerAddress: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    elevation: 2,
  },
  customerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  typeChip: {
    marginTop: 4,
  },
  chipText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
    backgroundColor: 'white',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItemGradient: {
    borderRadius: 12,
    padding: 16,
    minWidth: 80,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  formCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    elevation: 4,
    backgroundColor: 'white',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  divider: {
    marginVertical: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  calculationGradient: {
    borderRadius: 12,
    marginBottom: 24,
  },
  calculationCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 0,
    padding: 16,
  },
  calculationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  calculationTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  calculationValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  calculationNote: {
    fontSize: 12,
    color: '#64748b',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#64748b',
  },
  saveButtonGradient: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 6,
  },
  saveButton: {
    elevation: 0,
  },
});