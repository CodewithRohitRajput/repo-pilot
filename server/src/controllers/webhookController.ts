import type { Request, Response } from "express";
import Event from "../models/event.js";
import User from "../models/user.js";
import Repository from "../models/repository.js";
import Rule from "../models/rule.js";


export const githubWebhook = async (req: Request, res: Response) => {
    // console.log(req.headers)
    // console.log(req.body)

    const deliveryId = req.headers["x-github-delivery"] as string
    // console.log("delivery ID", deliveryId)
    const alreadyProcessed = await Event.findOne({
        deliveryId
    })  

    
    if(alreadyProcessed){
        return res.sendStatus(200)
    }
    const event = req.headers["x-github-event"] as string;
    
          if(req.body.action !== "opened"){
        return res.sendStatus(200)
    }

    if (event === "pull_request") {

        const newEvent = await Event.create({
            eventType: req.headers['x-github-event'],
            action: req.body.action,
            repository: req.body.repository.full_name,
            issueTitle: req.body.issue.title,
            sender: req.body.sender.login,
            payload: req.body,
            deliveryId
        })
        
    }
    if (event === "pull_request") {

    await Event.create({
        eventType: event,
        action: req.body.action,
        repository: req.body.repository.full_name,
        issueTitle: req.body.pull_request.title,
        sender: req.body.sender.login,
        payload: req.body,
        deliveryId
    });

    return res.sendStatus(200);
}
  

if (event === "push") {

    await Event.create({
        eventType: event,
        action: "push",
        repository: req.body.repository.full_name,
        issueTitle: req.body.head_commit?.message || "Push Event",
        sender: req.body.pusher.name,
        payload: req.body,
        deliveryId
    });

    return res.sendStatus(200);
}

    const repo = await Repository.findOne({
        fullName: req.body.repository.full_name
    })

    if(!repo){
        return res.sendStatus(200)
    }

    const user = await User.findById(repo.user)
    if(!user){
        return res.sendStatus(200)
    }

    const rule = await Rule.findOne({
        user: user._id
    })
    if(!rule) {
        return res.sendStatus(200)
    }

    const title = req.body.issue?.title?.toLowerCase() || "";

    if(!title.includes(rule.keyword?.toLowerCase())){
        return res.sendStatus(200)
    }
  

   const label =  await fetch(

`https://api.github.com/repos/${repo.fullName}/labels`,

{
    method:"POST",

    headers:{
        Authorization:`token ${user.accessToken}`,
        Accept:"application/vnd.github+json",
        "Content-Type":"application/json"
    },

    body:JSON.stringify({

        name:"bug",

        color:"d73a4a"

    })

}
)

const data = await label.json()

// console.log(data)


    const haveBug = await fetch(`https://api.github.com/repos/${repo.fullName}/issues/${req.body.issue.number}/labels`,
        {
            method: "POST",
            headers: {
                    Authorization:`token ${user.accessToken}`,
                    Accept:"application/vnd.github+json",
                    "Content-Type":"application/json"
            },
            body: JSON.stringify({
                labels: [rule.label]
            })
        }
  )
const dataBug = haveBug.json()
// console.log(dataBug)

if(rule.slackEnabled){

    
    const slack =  await fetch(process.env.SLACK_WEBHOOK_URL!, {
        
        method: "POST",
        
        headers: {
            "Content-Type": "application/json"
        },
        
        body: JSON.stringify({
            
            text:
            `🚨 New Issue
            
            Repository : ${repo.fullName}
            
            Title : ${req.body.issue.title}
            
            Opened By : ${req.body.sender.login}`
            
        })
        
    });
    
    const slackData = await slack.json()
    
    console.log(slackData)
}
    
    return res.sendStatus(200)
}

export default {
    githubWebhook
}