import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Text,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { apiService } from '../src/services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    todayCollections: 0,
    pendingUpdates: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toLocaleDateString('en-IN');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const customers = await apiService.getCustomers();
      const todayDate = new Date().toISOString().split('T')[0];
      const dailyUpdates = await apiService.getDailyUpdates(todayDate);
      
      const todayDeliveries = dailyUpdates.reduce((sum, update) => sum + update.delivered_qty, 0);
      const todayCollections = dailyUpdates.reduce((sum, update) => sum + update.collected_qty, 0);
      const pendingUpdates = customers.length - dailyUpdates.length;

      setStats({
        todayDeliveries,
        todayCollections,
        pendingUpdates: Math.max(0, pendingUpdates),
        totalCustomers: customers.length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const quickActions = [
    {
      title: 'Search Customers',
      subtitle: 'Find customers for delivery',
      icon: 'search',
      color: '#1e40af',
      gradient: ['#1e40af', '#3b82f6'],
      onPress: () => router.push('/customers'),
    },
    {
      title: 'Today\'s Summary',
      subtitle: 'View delivery summary',
      icon: 'today',
      color: '#059669',
      gradient: ['#059669', '#10b981'],
      onPress: () => {
        Toast.show({
          type: 'info',
          text1: 'Today\'s Summary',
          text2: `${stats.todayDeliveries} delivered, ${stats.todayCollections} collected`,
        });
      },
    },
  ];

  const statsData = [
    { 
      title: "Today's Deliveries", 
      value: stats.todayDeliveries.toString(), 
      icon: 'car', 
      color: '#1e40af',
      gradient: ['#1e40af', '#3b82f6']
    },
    { 
      title: 'Collections', 
      value: stats.todayCollections.toString(), 
      icon: 'return-up-back', 
      color: '#059669',
      gradient: ['#059669', '#10b981']
    },
    { 
      title: 'Pending Updates', 
      value: stats.pendingUpdates.toString(), 
      icon: 'time', 
      color: '#dc2626',
      gradient: ['#dc2626', '#ef4444']
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Card */}
      <LinearGradient
        colors={['#1e40af', '#3b82f6']}
        style={styles.headerGradient}
      >
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Title style={styles.welcomeTitle}>Welcome Back!</Title>
                <Paragraph style={styles.dateText}>Today: {today}</Paragraph>
                <Paragraph style={styles.subText}>Ready for deliveries</Paragraph>
              </View>
              <Surface style={styles.logoContainer}>
                <Ionicons name="car" size={40} color="#1e40af" />
              </Surface>
            </View>
          </Card.Content>
        </Card>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <LinearGradient
              key={index}
              colors={stat.gradient}
              style={styles.statGradient}
            >
              <Card style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <Ionicons name={stat.icon as any} size={28} color="white" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </Card.Content>
              </Card>
            </LinearGradient>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action, index) => (
          <LinearGradient
            key={index}
            colors={action.gradient}
            style={styles.actionGradient}
          >
            <Card style={styles.actionCard}>
              <Card.Content>
                <View style={styles.actionContent}>
                  <View style={styles.actionInfo}>
                    <Title style={styles.actionTitle}>{action.title}</Title>
                    <Paragraph style={styles.actionSubtitle}>
                      {action.subtitle}
                    </Paragraph>
                  </View>
                  <Button
                    mode="contained"
                    onPress={action.onPress}
                    style={styles.actionButton}
                    buttonColor="rgba(255,255,255,0.2)"
                    textColor="white"
                  >
                    <Ionicons name={action.icon as any} size={20} color="white" />
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </LinearGradient>
        ))}
      </View>

      {/* Instructions */}
      <Card style={styles.instructionsCard}>
        <Card.Content>
          <Title style={styles.instructionsTitle}>How to Use</Title>
          <Divider style={styles.divider} />
          <View style={styles.instructionItem}>
            <Ionicons name="search" size={20} color="#1e40af" />
            <Text style={styles.instructionText}>
              Search for customers by name or phone number
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="create" size={20} color="#059669" />
            <Text style={styles.instructionText}>
              Update delivery and collection quantities
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="sync" size={20} color="#7c3aed" />
            <Text style={styles.instructionText}>
              Data syncs automatically with main system
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
  headerGradient: {
    margin: 16,
    borderRadius: 16,
  },
  headerCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  dateText: {
    color: '#64748b',
    marginTop: 4,
  },
  subText: {
    color: '#1e40af',
    fontWeight: '600',
    marginTop: 2,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    elevation: 4,
  },
  statsContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statGradient: {
    width: (width - 48) / 3,
    borderRadius: 12,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 0,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  actionsContainer: {
    margin: 16,
  },
  actionGradient: {
    borderRadius: 12,
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 0,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  actionButton: {
    borderRadius: 25,
    elevation: 2,
  },
  instructionsCard: {
    margin: 16,
    marginBottom: 32,
    elevation: 4,
    backgroundColor: 'white',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  divider: {
    marginVertical: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  instructionText: {
    marginLeft: 16,
    color: '#64748b',
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});