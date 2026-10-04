import {Route,Routes} from 'react-router-dom';
import Landing from './Landing';import Shell from './Shell';
export default function App(){return <Routes><Route path="/" element={<Landing/>}/><Route path="/app/*" element={<Shell/>}/></Routes>}
