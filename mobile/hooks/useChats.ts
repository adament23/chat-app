import { useApi } from "@/lib/axios";
import type { Chat } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChats = () => {
    const { apiWithAuth } = useApi();
    

    return useQuery<Chat[], Error>({
        queryKey: ['chats'],
        queryFn: async (): Promise<Chat[]>=> {
            const { data } = await apiWithAuth({
                method: 'GET',
                url: '/chats'
            })
           return data as Chat[]    
        }
    })
}

export const useGetOrCreateChat = () => {
    const { apiWithAuth } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (participantId: string) => {
            const { data } = await apiWithAuth<Chat>({
                method: 'POST',
                url: `/chats/with/${participantId}`,
            })
            return data ;
        },
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
    })
}