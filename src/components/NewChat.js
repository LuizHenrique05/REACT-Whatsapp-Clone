import React, {useState, useEffect} from 'react';
import './NewChat.css';

import Api from '../Api';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default ({chatList, show, setShow, user}) => {

    const [list, setList] = useState([]);

    useEffect(() => {
        const getList = async () => {
            if(user !== null) {
                let results = await Api.getContactList(user.id);
                setList(results);
            }
        }
        getList();
    }, [user]);

    const addNewChat = async (user2) => {
        await Api.addNewChat(user, user2);

        handleClose();
    }

    const handleClose = () => {
        setShow(false);
    }

    return (
        <div className="newchat" style={{left: show ?0:-415}}>
            <div className="newchat__header">
                <div onClick={handleClose} class="newchat__backbutton">
                    <ArrowBackIcon style={{color: '#fff'}} />
                </div>
                <div className="newchat__title">
                    Nova Conversa
                </div>
            </div>
            <div class="newchat__list">
                {list.map((item, key) => (
                    <div className="newchat__item" key={key} onClick={()=>addNewChat(item)}>
                        <img className="newchat__avatar" src={item.avatar} alt="" />
                        <div className="newchat__name">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}