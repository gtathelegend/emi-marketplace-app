import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import {
  ProductListItem,
  ProductDetail,
  ApplicationResult,
  ProductQueryParams,
  CreateApplicationPayload,
} from '../types/api';

export function useProducts(params: ProductQueryParams) {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.search) queryParams.set('search', params.search);
  if (params.brand) queryParams.set('brand', params.brand);
  if (params.category) queryParams.set('category', params.category);
  if (params.sort) queryParams.set('sort', params.sort);

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const envelope = await apiClient.getEnvelope<ProductListItem[]>(endpoint);
      return {
        items: envelope.data,
        pagination: envelope.meta.pagination || {
          page: params.page || 1,
          limit: params.limit || 12,
          total: envelope.data.length,
          totalPages: 1,
        },
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Product slug is required');
      return apiClient.get<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useApplication(applicationNumber: string) {
  return useQuery({
    queryKey: ['application', applicationNumber],
    queryFn: async () => {
      if (!applicationNumber) throw new Error('Application reference is required');
      return apiClient.get<ApplicationResult>(`/applications/${encodeURIComponent(applicationNumber)}`);
    },
    enabled: Boolean(applicationNumber),
    retry: false, // Don't aggressively retry 404s
  });
}

export function useCreateApplication() {
  return useMutation({
    mutationFn: async (payload: CreateApplicationPayload) => {
      return apiClient.post<ApplicationResult>('/applications', payload);
    },
  });
}
