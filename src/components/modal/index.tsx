import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

import { FiScissors, FiUser } from "react-icons/fi";
import { FaMoneyBillAlt } from "react-icons/fa";

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

interface ModalInfoProps {
    isOpen: boolean;
    onOpen: () => void;
    onCLose: () => void;
    data: ScheduleItemProps;
    finishService: () => Promise<void>;
}

export function ModalInfo({
    isOpen,
    onCLose,
    onOpen,
    data,
    finishService
}: ModalInfoProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onCLose}
        >
            <ModalOverlay />
            <ModalContent
                bg='barber.400'
            >
                <ModalHeader
                    color='white'
                >
                    Próximo
                </ModalHeader>
                <ModalCloseButton color='white' />

                <ModalBody>
                    <Flex
                        align='center'
                        mb={3}
                    >
                        <FiUser
                            size={28}
                            color='#ffb13e'
                        />
                        <Text
                            ml={3}
                            fontSize='2xl'
                            fontWeight='bold'
                            color='white'
                        >
                            {data?.customer}
                        </Text>
                    </Flex>
                    <Flex
                        align='center'
                        mb={3}
                    >
                        <FiScissors
                            size={28}
                            color='#ffffff'
                        />
                        <Text
                            ml={3}
                            fontSize='2xl'
                            fontWeight='bold'
                            color='white'
                        >
                            {data?.haircut?.name}
                        </Text>
                    </Flex>
                    <Flex
                        align='center'
                        mb={3}
                    >
                        <FaMoneyBillAlt
                            size={28}
                            color='#46ef75'
                        />
                        <Text
                            ml={3}
                            fontSize='2xl'
                            fontWeight='bold'
                            color='white'
                        >
                            R$ {data?.haircut?.price}
                        </Text>
                    </Flex>

                </ModalBody>
                <ModalFooter>
                    <Button
                        bg='button.cta'
                        _hover={{ bg: '#ffb13e' }}
                        color='white'
                        mr={3}
                        onClick={() => finishService()}
                    >
                        Finalizar Serviço
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    )
}