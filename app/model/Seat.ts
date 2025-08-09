import localseats from '../assets/seats.json';

interface GithubUser{
    ID:number;
    Team:string;
    Name:string;
    Account:string;
    Login:string;
  }
const GetGithubUser = (login:string|unknown):GithubUser => {
     return localseats.find((user) => user.Login === login) || { ID: 0, Team: "Unknown", Name: "Unknown", Account: "Unknown", Login: "Unknown" };
  }

export class Seat {
    login: string;
    id: number;
    name: string;
    team: string;
    created_at: string;
    last_activity_at: string;
    last_activity_editor: string;

    constructor(data: any) {
        this.login = data.assignee ? data.assignee.login : 'deprecated';
        const gitHubUser = GetGithubUser(this.login);
        if(gitHubUser.Team === "EPE"){
            gitHubUser.Team = "IT-eCommerce Platform Engineering";
        }else if(gitHubUser.Team === "EFS"){
            gitHubUser.Team = "Enterprise Facing Solutions";
        }else if(gitHubUser.Team === "DPE"){
            gitHubUser.Team = "IT-Data Platform & Enterpise Integration";
        }
        this.name = gitHubUser.Name;
        this.team = data.assigning_team ? data.assigning_team.name : gitHubUser.Team;

        this.id = data.assignee ? data.assignee.id : 0;
        //this.team = data.assigning_team ? data.assigning_team.name : '';
        this.created_at = data.created_at;
        this.last_activity_at = data.last_activity_at;
        this.last_activity_editor = data.last_activity_editor;
    }
}

export class TotalSeats {
    total_seats: number;
    seats: Seat[];

    constructor(data: any) {
        this.total_seats = data.total_seats;
        this.seats = data.seats.map((seat: any) => new Seat(seat));
    }
}