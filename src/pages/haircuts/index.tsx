import Head from "next/head";
import { Button, Flex, Heading, Stack, Switch, Text, useMediaQuery } from "@chakra-ui/react";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";

import { IoMdPricetag } from 'react-icons/io'
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import { ChangeEvent, useState } from "react";

interface HaircutItem {
    id: string;
    name: string;
    price: number | string;
    status: boolean;
    user_id: string;
}

interface HaircutsProps {
    haircuts: HaircutItem[];
}

export default function Haircuts({ haircuts }: HaircutsProps) {
    const [isMobile] = useMediaQuery('(max-width: 500px)');
    const [haircutList, setHaircutList] = useState<HaircutItem[]>(haircuts || []);
    const [disableHaircut, setDisableHaircut] = useState('enabled');

    async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
        const apiClient = setupAPIClient();

        if (e.target.value === 'disabled') {
            setDisableHaircut('enabled')
            const response = await apiClient.get('/haircuts', {
                params: {
                    status: true
                }
            })

            setHaircutList(response.data)
        } else {
            setDisableHaircut('disabled')
            const response = await apiClient.get('/haircuts', {
                params: {
                    status: false
                }
            })

            setHaircutList(response.data)
        }
    }

    return (
        <>
            <Head>
                <title>Modelos de corte - Minha barbearia</title>
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
                        justifyContent='space-between'
                        mb={8}
                    >
                        <Heading
                            fontSize={isMobile ? '28px' : '3xl'}
                            mt={4}
                            mb={4}
                            mr={4}
                            color='orange.900'
                        >
                            Modelos de corte
                        </Heading>
                        <Link
                            href='/haircuts/new'
                        >
                            <Button
                                bg='gray.900'
                                _hover={{ bg: 'gray.800' }}
                                color='white'
                                borderWidth={1}
                                borderColor='white'
                            >
                                Cadastrar novo
                            </Button>
                        </Link>
                    </Flex>
                    <Flex
                        direction='row'
                        w='100%'
                        alignItems='center'
                        justifyContent='flex-start'
                        mb={8}
                    >
                        <Stack
                            ml='auto'
                            align='center'
                            direction='row'
                        >
                            <Text
                                fontWeight='bold'
                                color='white'
                            >
                                ATIVOS
                            </Text>
                            <Switch
                                colorScheme='green'
                                size='lg'
                                value={disableHaircut}
                                onChange={(e) => handleDisable(e)}
                                isChecked={disableHaircut === 'disabled' ? false : true}
                            />
                        </Stack>
                    </Flex>

                    {
                        haircutList.map(haircut => (
                            <Link
                                key={haircut.id}
                                href={`/haircuts/${haircut.id}`}
                                legacyBehavior
                            >
                                <Flex
                                    cursor='pointer'
                                    w='100%'
                                    p={4}
                                    bg='barber.400'
                                    direction={isMobile ? 'column' : 'row'}
                                    alignItems={isMobile ? 'flex-start' : 'center'}
                                    rounded='4'
                                    mb={2}
                                    justifyContent='space-between'
                                >
                                    <Flex
                                        mb={isMobile && 2}
                                        direction='row'
                                        alignItems='center'
                                        justifyContent='center'
                                    >
                                        <IoMdPricetag
                                            size={28}
                                            color='#fba931'
                                        />
                                        <Text
                                            fontWeight='bold'
                                            ml={4}
                                            noOfLines={2}
                                            color='white'
                                        >
                                            {haircut.name}
                                        </Text>
                                    </Flex>
                                    <Text
                                        fontWeight='bold'
                                        color='white'
                                    >
                                        R$ {haircut.price}
                                    </Text>
                                </Flex>
                            </Link>
                        ))
                    }

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
                haircuts: response.data
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