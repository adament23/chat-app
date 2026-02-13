import { useApi } from "@/lib/axios";
import type { Chat } from "@/types";
import { useQuery } from "@tanstack/react-query";

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