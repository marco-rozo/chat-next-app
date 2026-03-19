export function EmptyChatList() {
    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-zinc-500">Você ainda não tem nenhum chat</p>
            <p className="mt-1 text-sm text-zinc-400">Clique em "Novo Chat" para começar</p>
        </div>
    );
}
