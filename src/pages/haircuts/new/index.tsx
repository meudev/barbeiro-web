import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Flex, Heading, Input, Text, useMediaQuery } from "@chakra-ui/react";

import { Sidebar } from "@/src/components/sidebar";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";

import { FiChevronLeft } from "react-icons/fi";
import Router from "next/router";

interface NewHaircutProps {
    subscription: boolean;
    count: number;
}

export default function NewHaricut({ subscription, count }: NewHaircutProps) {
    const [isMobile] = useMediaQuery('(max-width: 500px)');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    async function handleRegister() {
        if (name === '' || price === '') {
            return;
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/haircut', {
                name,
                price: Number(price)
            })

            Router.push('/haircuts')
        } catch (error) {

        }
    }

    return (
        <>
            <Head>
                <title>BarberPRO - Novo modelo de corte</title>
            </Head>

            <Sidebar>
                <Flex
                    direction='column'
                    alignItems='flex-start'
                    justifyContent='flex-start'
                >
                    <Flex
                        direction='row'
                        w='100%'
                        alignItems= 'center'
                    >
                        <Link href='/haircuts'>
                            <Button
                                color='white'
                                bg='gray.900'
                                _hover={{ bg: 'gray.800'}}
                                p={4}
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                mr={4}
                            >
                                <FiChevronLeft
                                    size={24}
                                    color='white'
                                />
                                Voltar
                            </Button>
                        </Link>
                        <Heading
                            color='orange.900'
                            mt={4}
                            mb={4}
                            mr={4}
                            fontSize={isMobile ? '28px' : '3xl'}
                        >
                            Modelos de corte
                        </Heading>
                    </Flex>

                    <Flex
                        maxW='700px'
                        bg='barber.400'
                        w='100%'
                        align='center'
                        justify='center'
                        pt={8}
                        pb={8}
                        direction='column'
                    >
                        <Heading
                            fontSize={isMobile ? '22px' : '3xl'}
                            color='white'
                            mb={4}
                        >
                            Cadastar modelo
                        </Heading>
                        <Input
                            placeholder="Nome do corte"
                            size='lg'
                            type='text'
                            w='85%'
                            color='white'
                            bg='gray.900'
                            mb={3}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="Valor do corte ex: 59.90"
                            size='lg'
                            type='text'
                            w='85%'
                            color='white'
                            bg='gray.900'
                            mb={4}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <Button
                            w='85%'
                            size='lg'
                            color='gray.900'
                            mb={6}
                            bg='button.cta'
                            _hover={{ bg: '#ffb13e' }}
                            disabled={!subscription && count >= 3}
                            onClick={handleRegister}
                        >
                            Salvar
                        </Button>

                        {
                            !subscription && count >= 3 &&
                            (
                                <Flex
                                    direction='row'
                                    align='center'
                                    justifyContent='center'
                                >
                                    <Text
                                        color='white'
                                    >
                                        Você atingiu seu limite de cortes.
                                    </Text>
                                    <Link
                                        href='/planos'
                                    >
                                        <Text
                                            fontWeight='bold'
                                            color='#31fb6a'
                                            cursor='pointer'
                                            ml={1}
                                        >
                                            Seja premiun
                                        </Text>
                                    </Link>
                                </Flex>
                            )
                        }

                    </Flex>
                </Flex>

            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/haircut/check');
        const count = await apiClient.get('/haircut/count');

        return {
            props: {
                subscription: response.data?.subscription?.status === 'active' ? true : false,
                count: count.data
            }
        }
    } catch (error) {
        console.log(error)

        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            }
        }
    }

})