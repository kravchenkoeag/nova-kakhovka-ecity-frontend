// apps/admin/app/(dashboard)/users/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '@ecity/api-client';
import { useAccessToken } from '@ecity/auth';
import { DataTable } from '@/components/tables/data-table';
import { Button, Badge } from '@ecity/ui';
import { useState } from 'react';

const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL!);

export default function UsersPage() {
  const token = useAccessToken();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      // � ��������� ��� ���� ����� �� API
      return {
        users: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          total_pages: 0,
        },
      };
    },
    enabled: !!token,
  });

  const columns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'name',
      label: "��'�",
      render: (user: any) => (
        <div>
          <div className="font-medium">{user.first_name} {user.last_name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: '������',
      render: (user: any) => (
        <Badge variant={user.is_verified ? 'success' : 'warning'}>
          {user.is_verified ? '�������������' : '�� �������������'}
        </Badge>
      ),
    },
    {
      key: 'role',
      label: '����',
      render: (user: any) => (
        <Badge variant={user.is_moderator ? 'info' : 'default'}>
          {user.is_moderator ? '���������' : '����������'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'ĳ�',
      render: (user: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            �����������
          </Button>
          <Button size="sm" variant="outline">
            ����������
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div className="p-6">������������...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">������� ������������ �����</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">�����������</h1>
          <p className="text-gray-600 mt-1">
            ��������� ������������� �������
          </p>
        </div>
        <Button>������ �����������</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={data?.users || []}
          pagination={data?.pagination}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}