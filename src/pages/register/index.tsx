import { useContext, useState } from "react"
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import { AuthContext } from "../../context/AuthContext"
import { canSSRGuest } from "../../utils/canSSRGuest"

import logoImg from '../../../public/images/logo.svg'

export default function Register() {
    const { signUp } = useContext(AuthContext);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleRegister() {
        if (name === '' && email === '' && password === '') {
            return
        }

        await signUp({
            name,
            email,
            password
        })
    }

    return (
        <>
            <Head>
                <title>BarberPro - Crie sua conta</title>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        background="barber.400"
                        variant="filled"
                        size="lg"
                        placeholder="Nome da barbearia"
                        type="text"
                        mb={3}
                        color="white"
                    />
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
                        onClick={handleRegister}
                        background="button.cta"
                        mb={6}
                        color="gray.900"
                        size="lg"
                        _hover={{ bg: '#ffb13e' }}
                    >
                        Cadastrar
                    </Button>
                    <Center mt={2}>
                        <Link href="/login">
                            <Text cursor="pointer" color="white">
                                Ainda não possui conta? <strong>Faça login</strong>
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