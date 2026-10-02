import { createBrowserRouter } from 'react-router-dom'
import { Button } from './components/shared/Button.tsx'
import { PiggyBank } from 'lucide-react'

export const router = createBrowserRouter([
  {
    children: [
      {
        path: '/',
        element: (
          <>
            <h1>Formulário de Simulação</h1>
            <Button variant="primary" icon={PiggyBank}>
              Clique aqui
            </Button>
          </>
        ),
      },
      {
        path: '/resultado',
        element: <h1>Resultado da Simulação</h1>,
      },
      {
        path: '/historico',
        element: <h1>Histórico de Simulações</h1>,
      },
    ],
  },
])
