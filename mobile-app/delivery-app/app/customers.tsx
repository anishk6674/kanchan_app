import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Text,
  Chip,
  Surface,
  FAB,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { apiService, Customer } from '../src/services/api';

export default function CustomersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Loaded ${data.length} customers`,
      });
    } catch (error) {
      console.error('Error loading customers:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load customers. Check network connection.',
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
    setRefreshing(false);
  };

  const filterCustomers = () => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(
      customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone_number.includes(searchQuery),
    );
    setFilteredCustomers(filtered);
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'shop':
        return ['#1e40af', '#3b82f6'];
      case 'monthly':
        return ['#059669', '#10b981'];
      case 'order':
        return ['#7c3aed', '#a855f7'];
      default:
        return ['#64748b', '#94a3b8'];
    }
  };

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'shop':
        return 'storefront';
      case 'monthly':
        return 'calendar';
      case 'order':
        return 'cart';
      default:
        return 'person';
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    router.push(`/update/${customer.customer_id}`);
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <LinearGradient
      colors={getCustomerTypeColor(item.customer_type)}
      style={styles.customerGradient}
    >
      <Card style={styles.customerCard} onPress={() => handleCustomerSelect(item)}>
        <Card.Content>
          <View style={styles.customerHeader}>
            <View style={styles.customerInfo}>
              <Title style={styles.customerName}>{item.name}</Title>
              <Paragraph style={styles.customerPhone}>{item.phone_number}</Paragraph>
            </View>
            <Surface style={styles.iconContainer}>
              <Ionicons
                name={getCustomerTypeIcon(item.customer_type) as any}
                size={28}
                color={getCustomerTypeColor(item.customer_type)[0]}
              />
            </Surface>
          </View>

          <View style={styles.customerDetails}>
            <Chip
              style={[styles.typeChip, { backgroundColor: getCustomerTypeColor(item.customer_type)[0] }]}
              textStyle={styles.chipText}>
              {item.customer_type.toUpperCase()}
            </Chip>
            {item.can_qty && (
              <Text style={styles.canQty}>Default: {item.can_qty} cans</Text>
            )}
          </View>

          <Paragraph style={styles.customerAddress} numberOfLines={2}>
            {item.address}
          </Paragraph>

          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
            style={styles.updateButtonGradient}
          >
            <Button
              mode="contained"
              style={styles.updateButton}
              buttonColor="transparent"
              textColor={getCustomerTypeColor(item.customer_type)[0]}
              onPress={() => handleCustomerSelect(item)}>
              Update Status
            </Button>
          </LinearGradient>
        </Card.Content>
      </Card>
    </LinearGradient>
  );

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Loading customers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name or phone..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#1e40af"
          inputStyle={styles.searchInput}
        />
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredCustomers.length} customer(s) found
        </Text>
        <Button
          mode="outlined"
          onPress={loadCustomers}
          loading={loading}
          style={styles.refreshButton}
          textColor="#1e40af"
          disabled={loading}
        >
          Refresh
        </Button>
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={item => item.customer_id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No customers found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search terms
            </Text>
          </View>
        }
      />

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={loadCustomers}
        loading={loading}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  searchbar: {
    elevation: 4,
    backgroundColor: 'white',
  },
  searchInput: {
    fontSize: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  resultsText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  refreshButton: {
    borderColor: '#1e40af',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  customerGradient: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
  },
  customerCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 0,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  customerPhone: {
    color: '#64748b',
    fontSize: 15,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    elevation: 2,
  },
  customerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeChip: {
    marginRight: 12,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  canQty: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  customerAddress: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  updateButtonGradient: {
    borderRadius: 8,
  },
  updateButton: {
    elevation: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1e40af',
  },
});