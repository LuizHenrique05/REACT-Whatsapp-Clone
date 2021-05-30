import React, { useState, useEffect } from 'react';
import './App.css';

import Api from './Api';

import ChatListItem from './components/ChatListItem/index';
import ChatIntro from './components/ChatIntro/index';
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';
import Login from './components/Login';

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

export default() => {

    const [chatList, setChatList] = useState([]);
    const [activeChat, setActiveChat] = useState({});
    const [user, setUser] = useState(null);
    const [showNewChat, setShowNewChat] = useState(false);
    
    useEffect(() => {
        if(user !== null) {
            let unsub = Api.onChatList(user.id, setChatList);
            return unsub;
        }
    }, [user])

    const handleOpenNewChat = () => {
        setShowNewChat(true);
    }

    const handleLoginData = async (u) => {
        let newUser = {
            id: u.uid,
            name: u.displayName,
            avatar: u.photoURL
        }

        await Api.addUser(newUser); 
        setUser(newUser);
    }

    if(user === null) {
        return(<Login onReceive={handleLoginData} />)
    }

    return (
        <div className="app__window">
            <div className="sidebar">
                <NewChat chatList={chatList} show={showNewChat} setShow={setShowNewChat} user={user} />
                <header>
                    <img className="header__avatar" src="https://scontent.fcpq4-1.fna.fbcdn.net/v/t1.0-9/84527662_2656169677830095_524244098991783936_o.jpg?_nc_cat=100&ccb=3&_nc_sid=09cbfe&_nc_ohc=qm1aK4UCGUkAX_EPEDA&_nc_ht=scontent.fcpq4-1.fna&oh=460cded87e1410e700cb7635749df11d&oe=60534509" alt={user.name} />
                    <div className="header__btns">
                        <div class="btn">
                            <DonutLargeIcon style={{color: '#919191'}}/>
                        </div>
                        <div onClick={handleOpenNewChat} class="btn">
                            <ChatIcon style={{color: '#919191'}}/>
                        </div>
                        <div class="btn">
                            <MoreVertIcon style={{color: '#919191'}}/>
                        </div>
                    </div>
                </header>

                <div className="search">
                    <div className="search__input">
                        <SearchIcon fontSize="small" style={{color: '#919191'}} />
                        <input type="search" name="search_field" placeholder="Procurar ou iniciar uma nova conversa"/>
                    </div>
                </div>

                <div className="chat__list">
                    {
                        chatList.map((item, key) => (
                            <ChatListItem 
                                key={key}
                                data={item}
                                active={activeChat.chatId === chatList[key].chatId}
                                onClick={() => setActiveChat(chatList[key])}
                            />
                        ))
                    }
                </div>

            </div>
            <div className="content__area">
                {activeChat.chatId !== undefined && 
                    <ChatWindow user={user} data={activeChat} />
                }
                {activeChat.chatId === undefined && 
                    <ChatIntro /> 
                } 
            </div>
        </div>
    )
}