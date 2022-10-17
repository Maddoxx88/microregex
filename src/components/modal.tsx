import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Button, Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";

type ContentType = {
	[key: string]: string;
};

type Props = {
	name?: string;
	description?: string;
	content?: ContentType;
	tags?: string[];
	preview?: string;
	url?: string;
	selectedLang: string;
    isOpen: boolean;
    isLg: boolean;
	isTab: boolean;
    onClose: () => void;
};

const InfoModal = ({name, isOpen, onClose, isLg, isTab}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInBottom' size={isLg ? (isTab ? "xl" : "xl") : "xs"}>
        <ModalOverlay       bg='none'
      backdropFilter='auto'
      backdropBlur='2.8px'/>
        <ModalContent>
            <ModalHeader>{name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Link href='https://replit.com/@Maddoxx88/react-tic-tac-toehttps://chakra-ui.com' isExternal>
Try this <ExternalLinkIcon mx='2px' />
</Link>
            </ModalBody>

            <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button colorScheme="blue">Secondary Action</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export default InfoModal