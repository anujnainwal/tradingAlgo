import React, { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import BacktestHome from "./Components/Backtest/BacktestHome";
import { Container, Content, Header, Affix } from "rsuite";
import HeaderNavbar from "./Components/Navbar/HeaderNavbar";
import SideNavbar from "./Components/Navbar/SideNavbar";


export default function App() {

  return (
    <>
    <Container>
    <Routes>
    
     <Route path="/" element={<Login />} />
<Route
          path="/*"
          element={
            <><Affix>
             <Header><HeaderNavbar /></Header>
             </Affix>
              <Container>
              <SideNavbar />
        <Content style={{padding: "2%"}}>
        <Routes>
        <Route path="/backtest" element={<BacktestHome />} />
        </Routes>
      </Content>
      </Container>
                
                
              
            </>
          }
        />

      
   
     
 
    </Routes>
    </Container>
   </>
  );

}
