import { useContext, useState } from "react"
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import { AuthContext } from "../../context/AuthContext"
import { canSSRGuest } from "../../utils/canSSRGuest"

import logoImg from '../../../public/images/logo.svg'

export default function Login() {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('barbearialindoia@meudev.com.br');
    const [password, setPassword] = useState('123456');

    async function handleLogin() {

        if (email === '' || password === '') {
            return
        }

        await signIn({
            email,
            password
        })
    }

    return (
        <>
            <Head>
                <title>BarberPro - Faça login para acessar</title>
            </Head>
            <Flex
                background="barber.900"
                height="100vh"
                alignItems="center"
                justifyContent="center"
            >
                <Flex width={640} direction="column" p={14} rounded={8}>
                    <Center p={4}>
                        <Image
                            src={logoImg}
                            quality={100}
                            width={240}
                            alt="Logo barberpro"
                        />
                    </Center>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        background="barber.400"
                        variant="filled"
                        size="lg"
                        placeholder="email@email.com"
                        type="email"
                        mb={3}
                        color="white"
                    />
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        background="barber.400"
                        variant="filled"
                        size="lg"
                        placeholder="******"
                        type="password"
                        mb={6}
                        color="white"
                    />
                    <Button
                        onClick={handleLogin}
                        background="button.cta"
                        mb={6}
                        color="gray.900"
                        size="lg"
                        _hover={{ bg: '#ffb13e' }}
                    >
                        Acessar
                    </Button>
                    <Center mt={2}>
                        <Link href="/register">
                            <Text cursor="pointer" color="white">
                                Ainda não possui conta? <strong>Cadastre-se</strong>
                            </Text>
                        </Link>
                    </Center>
                </Flex>
            </Flex>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return { props: {} }
})