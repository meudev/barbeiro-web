import Head from "next/head";
import { Button, Flex, Heading, Text, useMediaQuery } from "@chakra-ui/react";

import { Sidebar } from "@/src/components/sidebar";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { getStripeJs } from "@/src/services/stripe-js";

interface UserProps {
    id: string;
    name: string;
    email: string;
    endereco: string | null;
}

interface PlanosProps {
    user: UserProps;
    premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {
    const [isMobile] = useMediaQuery('(max-width: 500px)');

    const handleSubscribe = async () => {

        if (premium) {
            return;
        }

        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.post('/subscribe');

            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId: sessionId })

        } catch (error) {
            console.log(error)
            alert('Erro no pagamento.')
        }
    }

    async function handleCreatePortal() {
        try {
            if (!premium) {
                return;
            }

            const apiClient = setupAPIClient();
            const response = apiClient.post('/create-portal');

            const { sessionId } = (await response).data;

            window.location.href = sessionId;

        } catch (error) {

        }
    }

    return (
        <>
            <Head>
                <title>BarberPro - Planos</title>
            </Head>
            <Sidebar>
                <Flex
                    w='100%'
                    direction='row'
                    align='center'
                    justify='flex-start'
                >
                    <Link href='/profile'>
                        <Button
                            color='white'
                            bg='gray.900'
                            _hover={{ bg: 'gray.800' }}
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
                        fontSize='3xl'
                        mt={4}
                        mb={4}
                        mr={4}
                        color='orange.900'
                    >
                        Planos
                    </Heading>
                </Flex>
                <Flex
                    pb={8}
                    maxW='700px'
                    w='100%'
                    direction='column'
                    align='flex-start'
                    justify='flex-start'
                >
                    <Flex
                        w='100%'
                        gap={4}
                        flexDirection={isMobile ? 'column' : 'row'}
                    >
                        <Flex
                            rounded={4}
                            p={2}
                            flex={1}
                            bg='barber.400'
                            flexDirection='column'
                        >
                            <Heading
                                textAlign='center'
                                fontSize='2xl'
                                mt={2}
                                mb={4}
                                color='gray.100'
                            >
                                Grátis
                            </Heading>
                            <Text ml={4} color='white' >
                                Registrar cortes.
                            </Text>
                            <Text ml={4} color='white' >
                                Criar apenas 3 modelos de corte.
                            </Text>
                            <Text ml={4} color='white' >
                                Editar dados do perfil.
                            </Text>
                        </Flex>

                        <Flex
                            rounded={4}
                            p={2}
                            flex={1}
                            bg='barber.400'
                            flexDirection='column'
                        >
                            <Heading
                                textAlign='center'
                                fontSize='2xl'
                                mt={2}
                                mb={4}
                                color='#31fb6a'
                            >
                                Premium
                            </Heading>
                            <Text ml={4} color='white' >
                                Registrar cortes ilimitados.
                            </Text>
                            <Text ml={4} color='white' >
                                Criar modelos de corte ilimiados.
                            </Text>
                            <Text ml={4} color='white' >
                                Editar dados do perfil.
                            </Text>
                            <Text ml={4} color='white' >
                                Editar modelos de cortes.
                            </Text>
                            <Text ml={4} color='white' >
                                Receber todas atualizações.
                            </Text>
                            <Text mb={4} mt={4} textAlign='center' fontWeight='bold' fontSize='2xl' ml={4} color='#31fb6a' >
                                R$ 9.90
                            </Text>
                            {
                                !premium ?
                                    (
                                        <Button
                                            bg='button.cta'
                                            _hover={{ bg: '#ffb13E' }}
                                            m={2}
                                            color='white'
                                            onClick={() => handleSubscribe()}
                                        >
                                            VIRAR PREMIUM
                                        </Button>
                                    ) : (
                                        <Flex
                                            flexDirection='column'
                                        >
                                            <Button
                                                bg='barber.900'
                                                _hover={{ bg: 'transparent' }}
                                                m={2}
                                                color='white'
                                                disabled
                                            >
                                                VOCÊ JÁ É PREMIUM
                                            </Button>
                                            <Button
                                                bg='white'
                                                m={2}
                                                color='barber.900'
                                                fontWeight='bold'
                                                onClick={handleCreatePortal}
                                            >
                                                ALTERAR ASSINATURA
                                            </Button>
                                        </Flex>
                                    )

                            }
                        </Flex>

                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/me');

        const user = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            endereco: response.data?.endereco,
        }

        return {
            props: {
                user: user,
                premium: response.data?.subscriptions?.status === 'active' ? true : false,
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