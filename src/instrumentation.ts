export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const router = await import('./app/_stm/StmRouter');
         router.StmRouter.instance;
      }
}
