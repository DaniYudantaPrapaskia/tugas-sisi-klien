import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useGetAll = (queryKey, apiFn) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: apiFn,
    gcTime: 5 * 60 * 1000,
  });
};

export const useGetById = (queryKey, apiFn, id) => {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => apiFn(id),
    enabled: !!id,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreate = (queryKey, apiFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useUpdate = (queryKey, apiFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useDelete = (queryKey, apiFn) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};
