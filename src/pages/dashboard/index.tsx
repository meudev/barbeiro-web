import { Button, Flex, Heading, Text, useMediaQuery, Link as ChakraLink, useDisclosure } from "@chakra-ui/react"
import Head from "next/head"

import { canSSRAuth } from "../../utils/canSSRAuth"

import { Sidebar } from "../../components/sidebar"
import Link from "next/link";
import { IoMdPerson } from "react-icons/io";
import { setupAPIClient } from "@/src/services/api";
import { useState } from "react";

import { ModalInfo } from "@/src/components/modal";

interface HaircutItemProps {
    id: string;
    name: string;
    price: string | number;
    user_id: string;
}

interface ScheduleItemProps {
    id: string;
    customer: string;
    haircut: HaircutItemProps;
}

interface DasboardProps {
    schedules: ScheduleItemProps[];
}

export default function Dashboard({ schedules }: DasboardProps) {
    const [isMobile] = useMediaQuery('(max-width: 500px)');
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [list, setList] = useState(schedules);
    const [service, setService] = useState<ScheduleItemProps>();

    function handleOpenModal(item: ScheduleItemProps) {
        setService(item);
        onOpen();
    }

    async function handleFinishService(id: string) {
        try {
            const apiClient = setupAPIClient()
            await apiClient.delete('/schedule', {
                params: {
                    schedule_id: id
                }
            })

            const filterItem = list.filter(item => {
                return (item?.id !== id)
            })
            
            setList(filterItem);
            onClose();
        } catch (error) {
            onClose();
            alert('Erro ao finalizar o serviço');
        }
    }

    return (
        <>
            <Head>
                <title>BarberPro - Seu sistema completo</title>
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
                            Agenda
                        </Heading>
                        <Link
                            href='/dashboard/new'
                        >
                            <Button
                                bg='gray.900'
                                _hover={{ bg: 'gray.800'}}
                                color='white'
                                borderWidth={1}
                                borderColor='white'
                            >
                                Registrar
                            </Button>
                        </Link>
                    </Flex>

                    {
                        list.map(item => (
                            <ChakraLink
                                key={item?.id}
                                w='100%'
                                m={0}
                                p={0}
                                mt={1}
                                bg='transparent'
                                style={{ textDecoration: 'none' }}
                                onClick={() => handleOpenModal(item)}
                            >
                                <Flex
                                    w='100%'
                                    cursor='pointer'
                                    p={4}
                                    bg='barber.400'
                                    direction={isMobile ? 'column' : 'row'}
                                    align={isMobile ? 'flex-start' : 'center'}
                                    rounded='4'
                                    mb={2}
                                    justify='space-between'
                                >
                                    <Flex
                                        w='100%'
                                        mb={isMobile && 4}
                                        direction='row'
                                        alignItems='center'
                                        justifyContent='flex-start'
                                    >
                                        <IoMdPerson
                                            size={28}
                                            color='#fba931'
                                        />
                                        <Text
                                            fontWeight='bold'
                                            ml={4}
                                            noOfLines={2}
                                            color='white'
                                        >
                                            {item?.customer}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        w='100%'
                                        direction='row'
                                        align='center'
                                        justify='space-between'
                                    >
                                        <Text
                                            fontWeight='bold'
                                            color='white'
                                            mb={isMobile && 2}
                                        >
                                            {item?.haircut?.name}
                                        </Text>
                                        <Text
                                            fontWeight='bold'
                                            color='white'
                                        >
                                            R$ {item?.haircut?.price}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </ChakraLink>
                        ))
                    }

                </Flex>
            </Sidebar>
            <ModalInfo
                isOpen={isOpen}
                onCLose={onClose}
                onOpen={onOpen}
                data={service}
                finishService={() => handleFinishService(service?.id)}
            />
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/schedule', {
            params: {
                status: true
            }
        });

        return {
            props: {
                schedules: response.data,
            }
        }
    } catch (error) {
        console.log(error)

        return {
            props: {
                schedules: []
            }
        }
    }

})