import {Scene, WebGLRenderer} from 'three';
import Camera from './objects/Camera';
import World from './core/World';
import Menu from "./objects/Menu";

const scene = new Scene();
const renderer = new WebGLRenderer({ antialias: true } );
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
            "Linkedin: <a href='https://www.linkedin.com/in/leonid-lazaryev-48411896/'>https://www.linkedin.com/in/leonid-lazaryev-48411896/</a>",
            "Github: <a href='https://github.com/pwroff'>https://github.com/pwroff</a>",
            "Facebook: <a href='https://www.facebook.com/leonid.lazaryev'>https://www.facebook.com/leonid.lazaryev</a>"
        ]
    },
    {
        text: "Education"
    },
    {
        text: "Experience"
    },
    {
        text: "Skill set"
    },
    {
        text: "Certificates & Awards",
        style: {
            fontSize: '1em'
        }
    },
    {
        text: "Other References",
        style: {
            fontSize: '1em'
        }
    },
    {
        text: "Non-technical experience",
        style: {
            fontSize: '.7em'
        }
    }
]);
const world = new World(scene, renderer, camera, menu);

world.spawn();