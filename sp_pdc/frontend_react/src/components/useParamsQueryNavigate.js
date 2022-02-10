import React from 'react';
import {
    useParams, // take the :params from URL
    useLocation, // pass-get state OR take info from address URL
    useNavigate // to navigate away
} from 'react-router-dom';

const x = () => {
    let params = useParams(); 
    let query = useQuery();
    let navigate = useNavigate(); // to navigate to different page. can embed state.

    // to get :params
    const [userId, setUserId] = React.useState(params.userId);
    const [name, setName] = React.useState(query.get('name'));


    // queries
    // web: https://www.google.com/search?q=abc+def&name=123

    let userId = 1;
    let name = 'John';
    navigate('/users', {state: {'userId': userId, 'name': name}});
}

function useQuery() {
    const {search} = useLocation(); // search are all the k-v pairs behind the ? in the url
    return React.useMemo(() => new URLSearchParams(search), [search]); // convert to and object of many k-v pairs
}

const y = () => {
    const {state} = useLocation(); // to retrieve state
    console.log(state.userId);
}