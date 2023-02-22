import { Sidebar } from "@/src/components/sidebar";
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { Button, Flex, Heading, Input, Select, useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { FiChevronLeft } from "react-icons/fi";

interface HaircutItemProps {
    id: string;
    name: string;
    price: number | string;
    status: boolean;
    user_id: string;
}

interface NewServiceProps {
    haircuts: HaircutItemProps[];
}

export default function NewService({ haircuts }: NewServiceProps) {
    const [isMobile] = useMediaQuery('(max-width: 500px)');
    const [name, setName] = useState('');
    const [haircutSelected, setHaircutSelected] = useState(haircuts[0]);

    function handleChangeSelect(id: string) {
        const haircutItem = haircuts.find(item => item.id === id);
        setHaircutSelected(haircutItem)
    }

    async function handleRegister() {
        if (name === '') {
            return;
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/schedule', {
                customer: name,
                haircut_id: haircutSelected?.id
            })

            Router.push('/dashboard')
        } catch (error) {

        }
    }

    return (
        <>
            <Head>
                <title>BarberPro - Novo Agendamento</title>
            </Head>
            <Sidebar>
                <Flex
                    direction='column'
                    alignItems='flex-start'
                    justifyContent='flex-start'
                >
                    <Flex
                        w='100%'
                        direction='row'
                        align='center'
                        justify='flex-start'
                    >
                        <Link href='/dashboard'>
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
                            Novo serviço
                        </Heading>
                    </Flex>
                    <Flex
                        maxW='700px'
                        pt={8}
                        pb={8}
                        width='100%'
                        direction='column'
                        align='center'
                        justify='center'
                        bg='barber.400'
                    >
                        <Input
                            placeholder="Nome do cliente"
                            size='lg'
                            type='text'
                            w='85%'
                            color='white'
                            bg='gray.900'
                            mb={3}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Select
                            mb={3}
                            size='lg'
                            w='85%'
                            bg='gray.900'
                            color='white'
                            onChange={(e) => handleChangeSelect(e.target.value)}
                        >
                            {
                                haircuts?.map(item => (
                                    <option
                                        key={item?.id}
                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                        value={item?.id}
                                    >
                                        {item?.name}
                                    </option>
                                ))
                            }
                        </Select>

                        <Button
                            w='85%'
                            size='lg'
                            color='gray.900'
                            bg='button.cta'
                            _hover={{ bg: '#ffb13e' }}
                            onClick={handleRegister}
                        >
                            Salvar
                        </Button>
                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/haircuts', {
            params: {
                status: true
            }
        });

        if (response.data === null) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }

        return {
            props: {
                haircuts: response.data,
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