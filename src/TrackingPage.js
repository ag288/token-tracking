import { TimeIcon } from "@chakra-ui/icons"
import { Box, Flex, Grid, GridItem, Heading, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from 'react-router-dom'
import api from "./api"
import { FullPageSpinner } from "./components/Spinner"

export const TrackingPage = () => {
   
    const [params] = useSearchParams()
 console.log(params.get('tokenID'))
    const [status, setStatus] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    useEffect(() => {
        setIsLoading(true)
        api.token.trackToken({ tokenID: params.get('tokenID'), phone: params.get('phone') }).then((res) => {
            setIsLoading(false)
            const response = JSON.parse(res.data)
            if (response.message)
                setMessage(response.message)
            else
                setStatus(response.status)
        })
    }, [])

    function DecideMessage(item) {
        console.log(item)
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
            bg={"gray.100"}>
           
                <Stack mx="auto" my="auto" spacing={5}>

                    <Heading m={5} align="center">Spring Garden Medical Specialists' and Family Clinic</Heading>
                    {isLoading ? <FullPageSpinner /> :
                    message ? <Box align="center"><Heading size="md">{message}</Heading></Box> :
                        status.map((patient, index) => <Box key={index}>
                            <Heading size="md">{patient.patient}</Heading>
                            {status[index].tokenStatus.map((item, i) =>
                                <Box width="auto"
                                    bg="white"
                                    p={5}
                                    m={4}
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
                                            {/* {item.status ? <Text fontWeight={"bold"}>
                                    {item.status}
                                </Text> : (item.count == 1 ? <Text>
                                    There is <span style={{ fontWeight: "bold" }}>{item.count} more token</span> left for your turn
                                </Text> : <Text>
                                    There are <span style={{ fontWeight: "bold" }}>{item.count} more tokens</span> left for your turn
                                </Text>)} */}
                                            {DecideMessage(item)}
                                        </GridItem>
                                    </Grid>

                                </Box>)}
                        </Box>)}
                    
                </Stack>
        </Flex>
    )
}