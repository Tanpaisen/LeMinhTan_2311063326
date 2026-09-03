import React, { useEffect, useState } from 'react';
import type { ApiKey, ApiKeyCreateRequest } from '../../types/apiKey';
import { apiKeyApi } from '../../api/apiKeyApi';

export const ApiKeysPage: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [createdKey, setCreatedKey] = useState<string | null>(null);

    const [formData, setFormData] = useState<ApiKeyCreateRequest>({
        ownerName: '',
        scopes: 'courses:read',
        validDays: 30,
    });

    const fetchApiKeys = async () => {
        setLoading(true);
        try {
            const data = await apiKeyApi.getAll();
            setApiKeys(data);
        } catch (err) {
            alert('Không thể tải danh sách API Key');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newKey = await apiKeyApi.create(formData);
            setCreatedKey(newKey.keyValue);
            setFormData({ ownerName: '', scopes: 'courses:read', validDays: 30 });
            fetchApiKeys();
        } catch (err) {
            alert('Không thể tạo API Key mới');
        }
    };

    const handleRevoke = async (id: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn thu hồi API Key này? Action này không thể hoàn tác!')) return;
        try {
            await apiKeyApi.revoke(id);
            fetchApiKeys();
        } catch (err) {
            alert('Thu hồi API Key thất bại');
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Quản lý API Key Đối Tác</h2>

            {createdKey && (
                <div style={{ padding: '16px', backgroundColor: '#e6f4ea', border: '1px solid #34a853', borderRadius: '4px', marginBottom: '20px' }}>
                    <strong>Cấp API Key thành công!</strong> Hãy sao chép ngay, khóa này sẽ không hiển thị lại lần sau:
                    <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px', marginTop: '8px', color: '#137333' }}>
                        {createdKey}
                    </div>
                </div>
            )}

            {/* Form Cấp mới */}
            <form onSubmit={handleCreate} style={{ display: 'grid', gap: '12px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '24px' }}>
                <h3>Cấp API Key Mới</h3>
                <div>
                    <label>Tên Đối tác / Ứng dụng: </label>
                    <input
                        type="text"
                        required
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </div>
                <div>
                    <label>Scopes (phân tách bởi dấu phẩy): </label>
                    <input
                        type="text"
                        required
                        value={formData.scopes}
                        onChange={(e) => setFormData({ ...formData, scopes: e.target.value })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </div>
                <div>
                    <label>Thời hạn (ngày, để trống nếu vô hạn): </label>
                    <input
                        type="number"
                        value={formData.validDays || ''}
                        onChange={(e) => setFormData({ ...formData, validDays: e.target.value ? Number(e.target.value) : null })}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Tạo API Key
                </button>
            </form>

            {/* Danh sách Key */}
            <h3>Danh sách Key hiện có</h3>
            {loading ? <p>Đang tải...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                    <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ padding: '8px' }}>Tên Đối Tác</th>
                        <th style={{ padding: '8px' }}>Key (Rút gọn)</th>
                        <th style={{ padding: '8px' }}>Scopes</th>
                        <th style={{ padding: '8px' }}>Trạng Thái</th>
                        <th style={{ padding: '8px' }}>Hành Động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {apiKeys.map((k) => (
                        <tr key={k.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{k.ownerName}</td>
                            <td style={{ padding: '8px', fontFamily: 'monospace' }}>{k.keyValue.substring(0, 10)}...</td>
                            <td style={{ padding: '8px' }}>{k.scopes}</td>
                            <td style={{ padding: '8px', color: k.status === 'ACTIVE' ? 'green' : 'red', fontWeight: 'bold' }}>
                                {k.status}
                            </td>
                            <td style={{ padding: '8px' }}>
                                {k.status === 'ACTIVE' && (
                                    <button onClick={() => handleRevoke(k.id)} style={{ backgroundColor: '#d93025', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                                        Thu hồi
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};