
export async function register() {
   if (process.env.NEXT_RUNTIME === 'nodejs') {
      const StmRouter = await import('./app/_stm/StmRouter')
      new StmRouter.StmRouter()
      StmRouter.StmRouter._getVehiclePositions;
   }
}