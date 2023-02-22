import { Flex, Text } from "@chakra-ui/react"
import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <title>BarberPro - Seu sistema completo</title>
      </Head>
      <Flex background="barber.900" height="100vh" alignItems="center" justifyContent="center">
        <Text fontSize={30}>Olá</Text>
      </Flex>
    </>
  )
}