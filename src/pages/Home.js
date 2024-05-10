import React, {} from "react";
import { Col, Container, Row,
    Button, Card, CardBody, CardText, CardTitle,  } from "reactstrap";
import { useNavigate } from "react-router-dom";
// components

import NBA from "../images/nba.webp"


export default function Home() {

    let navigate = useNavigate();


        function nba() {
            navigate('/nba')
        }

    return(
        <Container className="d-flex w-100 h-75 mt-5 justify-content-center align-items-center">
  
               <Row>
                <Col className="h-25 rounded  ">
                <Card 
                    style={{
                        width: '25rem', 
                        height: '30rem'
                    }}
                    >
                    <img 
                    style={{height: '50%'}}
                        alt="Sample"
                        src={NBA}
                    />
                    <CardBody>
                        <CardTitle tag="h1">
                        NBA
                        </CardTitle>

                        <CardText>
                        Enjoy player and team statistics dating back to 1980
                        </CardText>
                        <Button onClick={nba}>
                        Check it out
                        </Button>
                    </CardBody>
                    </Card>
                </Col>
                
               </Row>

        </Container>
    );
}