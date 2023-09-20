import { TimeIcon } from "@chakra-ui/icons"
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Flex, Grid, GridItem, Heading, HStack, Icon, Image, Stack, Text, useMediaQuery, useToast, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from 'react-router-dom'
import api from "./api"
import { FullPageSpinner } from "./components/Spinner"

export const TrackingPage = () => {

    const [params] = useSearchParams()
    const [status, setStatus] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [details, setDetails] = useState({})
    const [message, setMessage] = useState("")
    const [error, setError] = useState(false)
    const [isLaptop, isMobile] = useMediaQuery(['(min-width: 1224px)', '(max-width: 1224px)'])

    useEffect(() => {
        setIsLoading(true)
        api.token.trackToken({
            tokenID: params.get('t'), phone: params.get('p'),
            date: params.get('d')
        }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data)
            if (response.message)
                setMessage(response.message)
            else if (response.status)
                setStatus(response.status)
            else if (response.result)
                setDetails(response.result)

        }).catch((err) => {
            setIsLoading(false)
            setError(true)

        })

        setInterval(() => {
            window.location.reload()
        }, 600000)

    }, [])

    function DecideMessage(item) {

        let msg = ""
        if (item.status) {
            if (item.status == "current")
                msg = "You are currently in with the doctor"
            else if (item.status == "completed")
                msg = "Thank you! Your consultation for today has been successfully completed"
            else if (item.status == "cancelled")
                msg = "This token has been cancelled!"
        }
        else if (item.time) {
            msg = item.time
        }

        else {

            if (item.count == 1)
                msg = `There is ${item.count} more token left for your turn. `
            else
                msg = `There are ${item.count} more tokens left for your turn. `
            if (item.otherStatus == "delayed")
                msg += "You are running late!"
        }
        //console.log(msg)
        return <Text fontWeight={"bold"}>{msg}</Text>

    }
    return (
        <Flex
            minH={'100vh'}
            //overflow={"scroll"}
            width="full"
            flexDir={"column"}
            bg={"gray.100"}>

            {/* <Stack mx="auto" p={2} my="auto" spacing={5}> */}

            <Heading m={5} align="center">Spring Garden Medical Specialists' and Family Clinic</Heading>
            {isLoading ? <FullPageSpinner /> :
                error ?
                    <Alert alignSelf={"center"} mt={5} mx={5} variant={"subtle"} width="fit-content" status='error'>
                        <AlertIcon />
                        <AlertTitle>An error occured</AlertTitle>
                        <AlertDescription>Please reload the page</AlertDescription>
                    </Alert> :
                    message ? <Box m={5} align="center">< Heading size="md">{message}</Heading></Box > :
                        <Stack direction={"column"} p={3}
                            spacing="auto">
                            <VStack>
                                <Heading size="md">Scan the QR Code when you arrive at the clinic</Heading>
                                <Image
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${params.get('t')}-${params.get('p')}`} />
                            </VStack>
                            <VStack>
                                {status.length > 0 ?
                                    status.map((patient, index) => <Box width="fit-content" p={2} key={index}>
                                        <Heading size="md">{patient.patient}</Heading>
                                        {status[index].tokenStatus.map((item, i) =>
                                            <Box width="auto"
                                                bg="white"
                                                p={2}
                                                m={2}
                                                key={i}
                                                rounded="lg">
                                                <Grid templateRows='repeat(3, 1fr)'
                                                    gap={0}
                                                    templateColumns='repeat(2, 1fr)'>
                                                    <GridItem>
                                                        <Text fontWeight={"bold"}>Token Number:</Text>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Text>{`${item.token}`}</Text>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Text fontWeight={"bold"}>Doctor:</Text>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Text>{`${item.doctor}`}</Text>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Text fontWeight={"bold"}>Status:</Text>
                                                    </GridItem>
                                                    <GridItem>
                                                        {DecideMessage(item)}
                                                    </GridItem>
                                                </Grid>

                                            </Box>)}
                                    </Box>)
                                    :
                                    <Box
                                        bg="white"
                                        p={2}
                                        m={3}
                                        width="auto"
                                        rounded="lg">
                                        <Heading mb={2} size="md">{details.name}</Heading>
                                        <Grid templateRows='repeat(3, 1fr)'
                                            gap={0}
                                            templateColumns='repeat(2, 1fr)'>
                                            <GridItem>
                                                <Text fontWeight={"bold"}>Token Number:</Text>
                                            </GridItem>
                                            <GridItem>
                                                <Text>{details.initials}-{details.tokenNo}</Text>
                                            </GridItem>
                                            <GridItem>
                                                <Text fontWeight={"bold"}>Date:</Text>
                                            </GridItem>
                                            <GridItem>
                                                <Text>{details.date}</Text>
                                            </GridItem>
                                            <GridItem>
                                                <Text fontWeight={"bold"}>Estimated Time:</Text>
                                            </GridItem>
                                            <GridItem>
                                                <Text>{details.start} - {details.end}</Text>
                                            </GridItem>
                                            <GridItem>
                                                <Text fontWeight={"bold"}>Doctor:</Text>
                                            </GridItem>
                                            <GridItem>
                                                <Text>{details.docName}</Text>
                                            </GridItem>
                                        </Grid>

                                    </Box>}
                            </VStack>
                        </Stack>
            }

            {
                status.length > 0 ? <Alert mt={5} mx={5} variant={"subtle"} width="fit-content" status='warning'>
                    <AlertIcon />
                    <AlertDescription>Status and timings mentioned above are approximate and may vary</AlertDescription>
                </Alert> : null
            }
            {/* </Stack> */}
        </Flex >
    )
}