import {Request, Response} from "express";
import {T} from "../libs/types/common";
import MemberService from "../models/Member.service";

const restaurantController: T = {};
restaurantController.goHome = (req: Request, res: Response) => {
    try {
      console.log("goHome");  //loyiha standarti.mantiq yetib kelganini for check 
      res.send("Home Page");
    } catch (err) {
       console.log("Error, goHome;", err);
    }   
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
      console.log("getLogin");  //loyiha standarti. 
      res.send("Login Page");
    } catch (err) {
       console.log("Error, getLogin;", err);
    }   
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
      console.log("getSignup");  //loyiha standarti. 
      res.send("Signup Page");
    } catch (err) {
       console.log("Error, getSignup;", err);
    }   
};


export default restaurantController; 