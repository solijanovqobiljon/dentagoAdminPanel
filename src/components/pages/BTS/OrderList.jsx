// src/pages/BTS/OrderList.jsx

import React, { useState } from 'react';
import { useData } from '../../../context/DataProvider';
import { Link } from 'react-router-dom';
import { Layout, Table, Button, Tag, Select, Modal, Form, Input, DatePicker, notification, Flex } from 'antd';
import { PlusOutlined, DollarOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Content } = Layout;
const { Option } = Select;

// OrderList komponenti
const OrderList = () => {
    const { data, updateOrderStatus, addOrder, updateData, t } = useData();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [form] = Form.useForm();

    // Ma'lumotlarni to'g'irlash
    const orders = data.btsOrders || [];
    const statuses = data.orderStatuses || [];
    const staff = data.staff || [];

    // statusId bo'yicha status obyektini topish
    const getStatus = (id) => statuses.find(s => s.id === id) || { name: "Noma'lum", color: "default" };

    // Xodim (Doctor/Technician) ismini ID orqali topish funksiyasi
    const getStaffName = (staffInfo) => {
        const match = staffInfo.match(/\(ID:(\d+)\)/);
        if (match) {
            const id = parseInt(match[1]);
            const member = staff.find(s => s.id === id);
            return member ? member.fio : staffInfo;
        }
        return staffInfo.split(' (ID:')[0];
    };

    // Xodim ID sini olish
    const getStaffId = (staffInfo) => {
        const match = staffInfo.match(/\(ID:(\d+)\)/);
        return match ? parseInt(match[1]) : null;
    };

    // Holatni o'zgartirishni boshqarish
    const handleStatusChange = (orderId, newStatusId) => {
        updateOrderStatus(orderId, newStatusId);
        notification.success({
            message: "Holat yangilandi",
            description: `Buyurtma #${orderId} holati "${getStatus(newStatusId).name}" ga o'zgartirildi.`,
            placement: 'bottomRight',
        });
    };

    // Yangi buyurtma qo'shish yoki tahrirlash
    const handleSaveOrder = (values) => {
        const dateDue = values.dateDue ? values.dateDue.format('YYYY-MM-DD') : null;

        const doctor = staff.find(s => s.id === values.doctorId);
        const technician = staff.find(s => s.id === values.technicianId);

        const orderData = {
            ...values,
            dateDue: dateDue,
            doctor: `${doctor.fio} (ID:${doctor.id})`,
            technician: `${technician.fio} (ID:${technician.id})`,
            price: Number(values.price)
        };

        if (editingOrder) {
            // Tahrirlash
            updateData('btsOrders', { id: editingOrder.id, ...orderData }, 'UPDATE');
            notification.success({
                message: "Buyurtma yangilandi",
                description: `Buyurtma #${editingOrder.id} muvaffaqiyatli yangilandi.`,
                placement: 'bottomRight',
            });
        } else {
            // Yangi qo'shish
            addOrder(orderData);
            notification.success({
                message: "Buyurtma yaratildi",
                description: `Yangi buyurtma ("${values.title}") muvaffaqiyatli qo'shildi.`,
                placement: 'bottomRight',
            });
        }

        setIsModalVisible(false);
        setEditingOrder(null);
        form.resetFields();
    };

    // Buyurtmani o'chirish
    const handleDeleteOrder = (order) => {
        Modal.confirm({
            title: 'Buyurtmani o\'chirish',
            content: `Haqiqatan ham "${order.title}" buyurtmasini o'chirmoqchimisiz?`,
            okText: 'Ha, o\'chirish',
            okType: 'danger',
            cancelText: 'Bekor qilish',
            onOk: () => {
                updateData('btsOrders', { id: order.id }, 'DELETE');
                notification.success({
                    message: "Buyurtma o'chirildi",
                    description: `Buyurtma #${order.id} muvaffaqiyatli o'chirildi.`,
                    placement: 'bottomRight',
                });
            }
        });
    };

    // Tahrirlash modalini ochish
    const handleEditOrder = (order) => {
        setEditingOrder(order);
        form.setFieldsValue({
            title: order.title,
            patientName: order.patientName,
            doctorId: getStaffId(order.doctor),
            technicianId: getStaffId(order.technician),
            price: order.price,
            dateDue: order.dateDue ? moment(order.dateDue) : null,
            comments: order.comments,
            paymentSystem: order.paymentSystem,
            paymentType: order.paymentType,
            deliveryMethod: order.deliveryMethod
        });
        setIsModalVisible(true);
    };

    // Ko'rish modalini ochish
    const handleViewOrder = (order) => {
        setViewingOrder(order);
        setIsViewModalVisible(true);
    };

    const columns = [
        {
            title: '# ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Buyurtma nomi',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            width: 200,
        },
        {
            title: 'Stomatolog',
            dataIndex: 'doctor',
            key: 'doctor',
            render: (text) => getStaffName(text),
            width: 150,
        },
        {
            title: 'Zubtexnik',
            dataIndex: 'technician',
            key: 'technician',
            render: (text) => getStaffName(text),
            width: 150,
        },
        {
            title: 'Buyurtma narxi',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `${text ? text.toLocaleString() : 0} so'm`,
            width: 120,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'To\'lov tizimi',
            dataIndex: 'paymentSystem',
            key: 'paymentSystem',
            render: (text) => text || '—',
            width: 130,
        },
        {
            title: 'To\'lov turi',
            dataIndex: 'paymentType',
            key: 'paymentType',
            render: (text) => text || '—',
            width: 110,
        },
        {
            title: 'Yetkazib berish',
            dataIndex: 'deliveryMethod',
            key: 'deliveryMethod',
            render: (text) => {
                const deliveryLinks = {
                    'BTS': 'https://bts.uz/uz/calculate',
                    'Uzpost': 'https://uz.post/uz/Kalkulyator',
                    'emu': 'https://emu.uz/mijoz/kuryer-chaqirish'
                };

                if (text && deliveryLinks[text]) {
                    return (
                        <a
                            href={deliveryLinks[text]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1890ff', textDecoration: 'underline' }}
                        >
                            {text}
                        </a>
                    );
                }
                return text || '—';
            },
            width: 130,
        },
        {
            title: 'Amallar',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewOrder(record)}
                        title="Ko'rish"
                    />
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditOrder(record)}
                        title="Tahrirlash"
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDeleteOrder(record)}
                        title="O'chirish"
                    />
                </div>
            )
        },
    ];

    return (
        <Layout className="site-layout">
            {/* Header */}
            <Flex justify="space-between" align="center" style={{
                padding: '16px 24px',
                background: '#fff',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Link to="/" className="hover:text-blue-600 transition-colors capitalize">{t('dashboard')}</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 dark:text-white capitalize">{t('orders_bts')}</span>
                    </div>
                </div>
                <Button
                    key="1"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingOrder(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                >
                    {t('add')}
                </Button>
            </Flex>

            <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1500 }}
                />
            </Content>

            {/* Yangi buyurtma qo'shish / tahrirlash modali */}
            <Modal
                title={editingOrder ? "Buyurtmani Tahrirlash" : "Yangi Buyurtma Yaratish"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingOrder(null);
                    form.resetFields();
                }}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveOrder}
                >
                    <Form.Item
                        name="title"
                        label="Buyurtma nomi (Masalan: Yuqori jag'ga keramik kron)"
                        rules={[{ required: true, message: 'Iltimos, buyurtma nomini kiriting!' }]}
                    >
                        <Input placeholder="Buyurtma nomi" />
                    </Form.Item>

                    <Form.Item
                        name="patientName"
                        label="Bemor F.I.O."
                        rules={[{ required: true, message: 'Iltimos, bemor ismini kiriting!' }]}
                    >
                        <Input placeholder="Bemorning to'liq ismi" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {/* Shifokorni tanlash */}
                        <Form.Item
                            name="doctorId"
                            label="Stomatolog (Buyurtma beruvchi)"
                            rules={[{ required: true, message: 'Stomatologni tanlang!' }]}
                            style={{ flex: 1 }}
                        >
                            <Select placeholder="Stomatologni tanlang">
                                {staff.filter(s => s.position === 'Shifokor' || s.position === 'Direktor').map(s => (
                                    <Option key={s.id} value={s.id}>{s.fio}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Texnikni tanlash */}
                        <Form.Item
                            name="technicianId"
                            label="Zubtexnik (Ishni bajaruvchi)"
                            rules={[{ required: true, message: 'Zubtexnikni tanlang!' }]}
                            style={{ flex: 1 }}
                        >
                            <Select placeholder="Zubtexnikni tanlang">
                                {staff.filter(s => s.position === 'Texnik').map(s => (
                                    <Option key={s.id} value={s.id}>{s.fio}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {/* Narx */}
                        <Form.Item
                            name="price"
                            label="Buyurtma narxi (so'mda)"
                            rules={[{ required: true, message: 'Narxni kiriting!' }]}
                            style={{ flex: 1 }}
                        >
                            <Input type="number" placeholder="500000" />
                        </Form.Item>

                        {/* Yakunlash sanasi */}
                        <Form.Item
                            name="dateDue"
                            label="Yakunlanish sanasi"
                            rules={[{ required: true, message: 'Sanani kiriting!' }]}
                            style={{ flex: 1 }}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {/* To'lov tizimi */}
                        <Form.Item
                            name="paymentSystem"
                            label="To'lov tizimi"
                            rules={[{ required: true, message: 'To\'lov tizimini tanlang!' }]}
                            style={{ flex: 1 }}
                        >
                            <Select placeholder="To'lov tizimini tanlang">
                                <Option value="Stomatolog">Stomatolog</Option>
                                <Option value="Zubtexnik">Zubtexnik</Option>
                                <Option value="50 ga 50">Ikki tomonlama to'lov</Option>
                            </Select>
                        </Form.Item>

                        {/* To'lov turi */}
                        <Form.Item
                            name="paymentType"
                            label="To'lov turi"
                            rules={[{ required: true, message: 'To\'lov turini tanlang!' }]}
                            style={{ flex: 1 }}
                        >
                            <Select placeholder="To'lov turini tanlang">
                                <Option value="Naqd">Naqd</Option>
                                <Option value="Click">Click</Option>
                                <Option value="Payme">Payme</Option>
                                <Option value="Karta">Karta</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    {/* Yetkazib berish */}
                    <Form.Item
                        name="deliveryMethod"
                        label="Yetkazib berish"
                        rules={[{ required: true, message: 'Yetkazib berish usulini tanlang!' }]}
                    >
                        <Select placeholder="Yetkazib berish usulini tanlang">
                            <Option value="BTS">
                                <a href="https://bts.uz/uz/calculate" target="_blank">BTS</a>
                            </Option>
                            <Option value="Uzpost">
                                <a href="https://uz.post/uz/Kalkulyator" target="_blank">Uzpost</a>
                            </Option>
                            <Option value="emu">
                                <a href="https://emu.uz/mijoz/kuryer-chaqirish" target="_blank">EMU</a>
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="comments"
                        label="Izohlar (Rangi, maxsus talablar)"
                    >
                        <Input.TextArea rows={3} placeholder="Masalan: Rangi A2, o'lcham 5, zirkon asosida." />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            {editingOrder ? 'Saqlash' : 'Buyurtmani Yaratish'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Ko'rish modali */}
            <Modal
                title="Buyurtma tafsilotlari"
                open={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                        Yopish
                    </Button>
                ]}
                width={600}
            >
                {viewingOrder && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div><strong>ID:</strong> {viewingOrder.id}</div>
                        <div><strong>Buyurtma nomi:</strong> {viewingOrder.title}</div>
                        <div><strong>Bemor:</strong> {viewingOrder.patientName}</div>
                        <div><strong>Stomatolog:</strong> {getStaffName(viewingOrder.doctor)}</div>
                        <div><strong>Zubtexnik:</strong> {getStaffName(viewingOrder.technician)}</div>
                        <div><strong>Narx:</strong> {viewingOrder.price?.toLocaleString()} so'm</div>
                        <div><strong>To'lov tizimi:</strong> {viewingOrder.paymentSystem || '—'}</div>
                        <div><strong>To'lov turi:</strong> {viewingOrder.paymentType || '—'}</div>
                        <div><strong>Yetkazib berish:</strong> {viewingOrder.deliveryMethod || '—'}</div>
                        <div><strong>Yakunlanish sanasi:</strong> {viewingOrder.dateDue ? moment(viewingOrder.dateDue).format('DD.MM.YYYY') : '—'}</div>
                        <div><strong>Holat:</strong> <Tag color={getStatus(viewingOrder.statusId).color.split('-')[0]}>{getStatus(viewingOrder.statusId).name}</Tag></div>
                        <div><strong>Izohlar:</strong> {viewingOrder.comments || '—'}</div>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default OrderList;
