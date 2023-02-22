import { Sidebar } from "@/src/components/sidebar";
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { Button, Flex, Heading, Input, Link, Stack, Switch, Text, useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import Router from "next/router";
import { ChangeEvent, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";

interface HaircutItemProps {
    id: string;
    name: string;
    price: number | string;
    status: boolean;
    user_id: string;
}

interface SubscriptionProps {
    id: string;
    status: string;
}

interface EditHaircutProps {
    haircut: HaircutItemProps;
    subscription: SubscriptionProps | null;
}

export default function EditHaircut({ haircut, subscription }: EditHaircutProps) {
    const [isMobile] = useMediaQuery('(max-width: 500px)');
    const [name, setName] = useState(haircut?.name);
    const [price, setPrice] = useState(haircut?.price);
    const [status, setStatus] = useState(haircut?.status);
    const [disableHaircut, setDisableHaircut] = useState(haircut?.status ? 'disabled' : 'enabled');

    function handleChangeStatus(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.value === 'disabled') {
            setDisableHaircut('enable')
            setStatus(false)
        } else {
            setDisableHaircut('disabled')
            setStatus(true)
        }
    }

    async function handleUpdate() {
        if (name === '' || price === '') {
            return;
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/haircut', {
                name,
                price: Number(price),
                status,
                haircut_id: haircut?.id
            })

            alert('Modelo atualizado.')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Head>
                <title>BarberPRO - Editando modelo de corte</title>
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
                        alignItems='center'
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
                            Editar modelo
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
                            Editar modelo
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

                        <Stack
                            mb={6}
                            align='center'
                            direction='row'
                        >
                            <Text
                                fontWeight='bold'
                                color='white'
                            >
                                Desativar modelo
                            </Text>
                            <Switch
                                size='lg'
                                colorScheme='red'
                                onChange={(e) => handleChangeStatus(e)}
                                value={disableHaircut}
                                isChecked={disableHaircut === 'disabled' ? false : true}
                            />
                        </Stack>

                        <Button
                            w='85%'
                            size='lg'
                            color='gray.900'
                            mb={6}
                            bg='button.cta'
                            _hover={{ bg: '#ffb13e' }}
                            onClick={handleUpdate}
                            disabled={subscription?.status !== 'active'}
                        >
                            Salvar
                        </Button>

                        {
                            subscription?.status !== 'active' &&
                            (
                                <Flex>
                                    <Link href="/planos">
                                        <Text
                                            fontWeight='bold'
                                            color='#31fb6a'
                                            cursor='pointer'
                                            mr={1}
                                        >
                                            Seja premium
                                        </Text>
                                    </Link>
                                    <Text
                                        color='white'
                                    >
                                        e tenha todos acessos liberados.
                                    </Text>
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
    const { id } = ctx.params;

    try {
        const apiClient = setupAPIClient(ctx);

        const check = await apiClient.get('/haircut/check');

        const response = await apiClient.get('/haircut/detail', {
            params: {
                haircut_id: id
            }
        });

        return {
            props: {
                haircut: response.data,
                subscription: check.data?.subscriptions
            }
        }
    } catch (error) {
        console.log(error)

        return {
            redirect: {
                destination: '/haircuts',
                permanent: false,
            }
        }
    }

})