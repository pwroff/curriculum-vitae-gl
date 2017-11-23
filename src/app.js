import {Scene, WebGLRenderer} from 'three';
import Camera from './objects/Camera';
import World from './core/World';
import Menu from "./objects/Menu";

const scene = new Scene();
const renderer = new WebGLRenderer({antialias: true});
const camera = new Camera();
const menu = new Menu([
    {
        text: "bio & contact",
        content: [
            "First name: Leonid",
            "Last name: Lazaryev",
            "Date of birth: 12.02.1988",
            "Civil status: Married",
            "Email: <a href='mailto:leonidlazaryev@gmail.com'>leonidlazaryev@gmail.com</a>",
            "Phone: <a href='tel:+420777448738'>+420777448738</a>",
            "Linkedin: <a target='_blank' href='https://www.linkedin.com/in/leonid-lazaryev-48411896/'>https://www.linkedin.com/in/leonid-lazaryev-48411896/</a>",
            "Github: <a target='_blank' href='https://github.com/pwroff'>https://github.com/pwroff</a>",
            "Facebook: <a target='_blank' href='https://www.facebook.com/leonid.lazaryev'>https://www.facebook.com/leonid.lazaryev</a>"
        ]
    },
    {
        text: "Education",
        content: [
            "Transcarpathian college of management, business and information technologies 'Erudit'",
            "Associates degree, Informatics",
            "2002 - 2007",
            "",
            "Lviv National Politechnical University",
            "Bachelor of Science, Project Management",
            "2007 - 2010",
            "",
            "Unicorn College",
            "Information Technologies",
            "2013 - 2015"
        ]
    },
    {
        text: "Experience",
        content: [
            "kitchenfeelings.net (Food blog, out of order)",
            "Full stack developer, Co Founder, Co Owner",
            "Jul 2015 - Jul 2016",
            "",
            "AppToCloud.com",
            "Javascript developer",
            "May 2015 - Feb 2018",
            "",
            "Others",
            "Reference list below"
        ]
    },
    {
        text: "Skill set",
        content: [
            [
                "<strong>Languages</strong>",
                "English - advanced",
                "Czech - advanced",
                "Russian - native",
                "Ukrainian - native"
            ],
            [
                "<strong>Programming Languages</strong>",
                "Frontend (Javascript + HTML + CSS) - exceptional",
                "Node.js - exceptional",
                "C++  - good",
                "GLSL - basic",
                "C# - basic",
                "Python - basic",
                "Ruby - basic",
                "Swift - basic"
            ],
            [
                "<strong>Web Frameworks, tools, libraries, APIs…</strong>",
                "ES6", "Canvas", "WebGL", "WebAudio",
                "React.js", "Redux", "SASS", "LESS", "svg",
                "three.js", "Express", "Apollo", "web sockets",
                "graphql", "REST"
            ],
            [
                "<strong>Databases</strong>",
                "MongoDB",
                "Redis",
                "Postgres", "MariaDB"
            ],
            [
                "<strong>Game Engines</strong>",
                "Unreal Engine - mid-level (~ 70 hours of tutorials)",
                "Unity - basic (~ 20 hours of tutorials)"
            ],
            [
                "<strong>Others</strong>",
                "git", "bash", "VS", "Xcode"
            ]
        ]
    },
    {
        text: "Certificates & Awards",
        style: {
            fontSize: '1em'
        },
        content: [
            "Czech Language level B1",
            "UJOP Krystal, Prague",
            "2013",
            "",
            "React Contest winner",
            "STRV, Prague",
            "2017"
        ]
    },
    {
        text: "Other References",
        style: {
            fontSize: '1em'
        },
        content: [
            "<a target='_blank' href='https://www.npmjs.com/package/colorer'>colorer</a> JS color manipulation library",
            "",
            "Eventio app - STRV React Contest <a target='_blank' href='https://eventio-contest.herokuapp.com'>https://eventio-contest.herokuapp.com</a> frontend + partially backend (client server + graphql middleware + sessions manager). API might be down already.",
            "",
            "<a target='_blank' href='http://cz.emclient.com/'>http://cz.emclient.com/</a> index page",
            "",
            "<a target='_blank' href='https://www.icewarp.com/'>https://www.icewarp.com/</a> 4 features animations on homepage.",
            "",
            "<a target='_blank' href='https://licensemanager.emclient.com/account/login?returnUrl='>https://licensemanager.emclient.com</a> email client licensing (credentials required)"
        ]
    },
    {
        text: "Non-technical experience",
        style: {
            fontSize: '.7em'
        },
        content: [
            "E-shop svetovod.com.ua",
            "Sales consultant, shop administration, content management",
            "Jul 2010 - Sep 2011",
            "",
            "Nightclub “Kashtan”",
            "Barman",
            "Mar 2006 - Jun 2008",
            "",
            "Hotel “Prague”",
            "Barman,  administrator",
            "Jul 2008 - May 2009",
            "",
            "Bar “Kashtan Lounge”",
            "Barman, barista",
            "Apr 2009 - Jun 2010",
            "",
            "Nightclub “Panorama”",
            "Barman",
            "Nov 2011 - Sep 2012"
        ]
    }
]);
const world = new World(scene, renderer, camera, menu);

world.spawn();