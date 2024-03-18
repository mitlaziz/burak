import {NextFunction, Request, Response} from "express";
import {T} from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService();  // bu instant pastdagi instlarning hamasi undir.pastda yozamasak ham

const restaurantController: T = {};
restaurantController.goHome = (req: Request, res: Response) => {
    try {
      console.log("goHome");  //loyiha standarti.mantiq yetib kelganini for check 
      res.render("home");  //send | json | redirect | end | render -response turlari 
    } catch (err) {
       console.log("Error, goHome;", err);
       res.redirect("/admin");
    }   
};
restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");  //loyiha standarti. 
    res.render("signup"); 
  } catch (err) {
     console.log("Error, getSignup;", err);
     res.redirect("/admin");
  }   
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
      console.log("getLogin");  //loyiha standarti. 
      res.render("login"); 
    } catch (err) {
       console.log("Error, getLogin;", err);
       res.redirect("/admin");  // xatolik bol>da adminga yubor
    }   
};


restaurantController.processSignup = async (
  req: AdminRequest, 
  res: Response
  ) => {
  try {
    console.log("processSignup");  //loyiha standarti. 
    const file = req.file;
    if(!file) throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path;
    newMember.memberType = MemberType.RESTAURANT;
    //const memberService = new MemberService();
    const result = await memberService.processSignup(newMember);
    //TODO: SESSIONS ATHENTICATION

    req.session.member = result;
    req.session.save(function() {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
     console.log("Error, processSignup;", err);
     const message = 
       err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
     res.send(
       `<script> alert("${message}"); window.location.replace('admin/signup) </script>`
       );
  }   
};

restaurantController.processLogin = async (
  req: AdminRequest, 
  res: Response
  ) => {
  try {
    console.log("processLogin");  //loyiha standarti.
    console.log("body:", req.body);
    const input: LoginInput = req.body;
    const result = await memberService.processlogin(input);
    //TODO: SESSIONS ATHENTICATION

    req.session.member = result; 
    req.session.save(function() {
      res.send(result);
    });

  } catch (err) {
     console.log("Error, processLogin;", err);
     const message = 
       err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
     res.send(
       `<script> alert("${message}"); window.location.replace('admin/login) </script>`
       );
  }   
};

restaurantController.logout = async (
  req: AdminRequest, 
  res: Response
  ) => {
  try {
    console.log("logout");  //loyiha standarti.
    req.session.destroy(function() {
      res.redirect("/admin");
    } );
  } catch (err) {
     console.log("Error, logout:", err);
     res.redirect("/admin/login");
  }   
};


restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers();
    
    res.render("users", {users: result});
  } catch (err) {
     console.log("Error, getUsers;", err);
     res.redirect("/admin");  
  }   
};


restaurantController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");  
    const result = await memberService.updateChosenUser(req.body);

    res.status(HttpCode.OK).json({data: result});
  } catch (err) {
     console.log("Error, updateChosenUser;", err);
     if(err instanceof Errors ) res.status(err.code).json(err);
     else res.status(Errors.standard.code).json(Errors.standard);
  }   
};

restaurantController.checkAuthSession = async (
  req: AdminRequest, 
  res: Response
  ) => {
  try {
    console.log("checkAuthSession");
    if(req.session?.member) 
      res.send(`<script> alert("${req.session.member.memberNick}") </script>`);
    else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}") </script>`);
  } catch (err) {
     console.log("Error, checkAuthSession:", err);
     res.send(err);
  }   
};

restaurantController.verifyRestaurant = (
  req: AdminRequest, 
  res: Response, 
  next: NextFunction 
 ) => {
    if(req.session?.member?.memberType === MemberType.RESTAURANT) {
      req.member = req.session.member;
      next();
    } else {
      const message = Message.NOT_AUTHENTICATED; 
      res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login); </script>`
      );
    } 
};
export default restaurantController;