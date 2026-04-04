import { View, Text, Modal, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import clsx from 'clsx';
import { icons } from '@/constants/icons';
import dayjs from 'dayjs';
import { usePostHog } from 'posthog-react-native'; // ✅ Use hook

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

type Frequency = 'Monthly' | 'Yearly';
type Category = 'Entertainment' | 'AI Tools' | 'Developer Tools' | 'Design' | 'Productivity' | 'Other';
const CATEGORIES: Category[] = ['Entertainment', 'AI Tools', 'Developer Tools', 'Design', 'Productivity', 'Other'];
const CATEGORY_COLORS: Record<Category, string> = {
  'Entertainment': '#ff6b6b',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  'Design': '#f5c542',
  'Productivity': '#95e1d3',
  'Other': '#d4d4d4',
};

// Predefined enum for subscription names to anonymize raw input
const SUBSCRIPTION_NAME_ENUM: Record<string, string> = {
  Netflix: 'entertainment_streaming',
  Spotify: 'entertainment_music',
  Figma: 'design_tool',
  GitHub: 'dev_tool',
  ChatGPT: 'ai_tool',
  Default: 'other_subscription',
};

// Price bands
function getPriceBand(price: number): string {
  if (price <= 10) return '0-10';
  if (price <= 50) return '10-50';
  return '50+';
}

const CreateSubscriptionModal = ({ visible, onClose, onSubmit }: CreateSubscriptionModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [category, setCategory] = useState<Category>('Other');

  const posthog = usePostHog(); // ✅ PostHog client

  const isValidPrice = () => {
    const trimmedPrice = price.trim();
    if (!trimmedPrice) return false;
    if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPrice)) return false;
    const numValue = Number(trimmedPrice);
    return Number.isFinite(numValue) && numValue > 0;
  };

  const isValidForm = name.trim() !== '' && isValidPrice();

  const handleSubmit = () => {
    if (!isValidForm) return;

    const priceValue = Number(price.trim());
    const now = dayjs();
    const renewalDate = frequency === 'Monthly' ? now.add(1, 'month') : now.add(1, 'year');

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      price: priceValue,
      currency: 'USD',
      category,
      status: 'active',
      startDate: now.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: icons.plus,
      billing: frequency,
      color: CATEGORY_COLORS[category],
    };

    onSubmit(newSubscription);

    // ✅ Anonymize data for PostHog
    const subscriptionKey = SUBSCRIPTION_NAME_ENUM[name.trim()] || SUBSCRIPTION_NAME_ENUM.Default;
    const priceBand = getPriceBand(priceValue);

    if (posthog) {
      posthog.capture('subscription_created', {
        subscription_key: subscriptionKey, // anonymized enum
        subscription_price_band: priceBand, // price bucket
        subscription_frequency: frequency,
        subscription_category: category,
      });
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('Other');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <Pressable className="modal-overlay" onPress={handleClose}>
          <Pressable className="modal-container" onPress={(e) => e.stopPropagation()}>
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              className="p-5"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
            >
              {/* Name Field */}
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Subscription name"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Price Field */}
              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Frequency Field */}
              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {['Monthly', 'Yearly'].map((f) => (
                    <Pressable
                      key={f}
                      className={clsx('picker-option', frequency === f && 'picker-option-active')}
                      onPress={() => setFrequency(f as Frequency)}
                    >
                      <Text
                        className={clsx('picker-option-text', frequency === f && 'picker-option-text-active')}
                      >
                        {f}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Category Field */}
              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      className={clsx('category-chip', category === cat && 'category-chip-active')}
                      onPress={() => setCategory(cat)}
                    >
                      <Text className={clsx('category-chip-text', category === cat && 'category-chip-text-active')}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                className={clsx('auth-button', !isValidForm && 'auth-button-disabled')}
                onPress={handleSubmit}
                disabled={!isValidForm}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;