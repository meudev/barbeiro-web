import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from '../context/AuthContext'

const styles = {
  global: {
    body: {
      color: 'gray.100',
    },
    a: {
      color: '#ffffff'
    }
  }
}

const colors = {
  barber: {
    900: '#12131b',
    400: '#1b1c29',
    100: '#c6c6c6'
  },
  button: {
    cta: '#fba931',
    default: '#ffffff',
    gray: '#dfdfdf',
    danger: '#ff4040'
  },
  orange: {
    900: '#fba931'
  }
}

const theme = extendTheme({ styles, colors })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}
