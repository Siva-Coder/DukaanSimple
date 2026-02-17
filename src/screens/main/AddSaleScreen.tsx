import React, { useState } from 'react'
import { SaleItem } from '../../models/Sale';

function AddSaleScreen() {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [paymentType, setPaymentType] = useState<'cash' | 'credit'>('cash');

  return (
    <div>AddSaleScreen</div>
  )
}

export default AddSaleScreen