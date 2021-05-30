import React, {useState, useEffect, useRef} from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.css';
import MessageItem from './MessageItem/index';

import Api from '../Api';

import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

export default ({data, user}) => {

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition();
    }

    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setList([]);
        let unsub = Api.onChatContent(data.chatId, setList, setUsers);
        return unsub;
    }, [data.chatId]);

    useEffect(() => {
        if(body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list])

    const  handleEmojiClick = (e, emojiObject) => {
        setText( text + emojiObject.emoji );
    };

    const handleOpenEmoji = () => {
        setEmojiOpen(true);
    }

    const handleCloseEmoji = () => {
        setEmojiOpen(false);
    }

    const handleMicClick = () => {
        if(recognition !== null) {

            recognition.onstart = () => {
                setListening(true);
            }
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (e) => {
                setText( e.results[0][0].transcript );
            }

            recognition.start();
        }
    }

    const handleInputKeyUp = (e) => {
        if(e.keyCode == 13) {
            handleSendClick();
        }
    }   

    const handleSendClick = () => {
        if(text !== '') {
            Api.sendMessage(data, user.id, 'text', text, users);
            setText('');
            setEmojiOpen(false);
        }
    }

    return (
        <div className="chatWindow">
            <div className="chatWindow__header">
                <div className="chatWindow__headerInfo">
                    <img className="chatWindow__image" src={data.image} alt="" />
                    <div className="chatWindow__name">{data.title}</div>
                </div>

                <div className="chatWindow__headerBtn">
                    <div className="btn">
                        <SearchIcon style={{color: '#919191'}} />
                    </div>
                    <div className="btn">
                        <AttachFileIcon style={{color: '#919191'}} />
                    </div>
                    <div className="btn">
                        <MoreVertIcon style={{color: '#919191'}} />
                    </div>
                </div>
            </div>
            
            <div ref={body} className="chatWindow__body">
                {list.map( (item, key) => (
                    <MessageItem key={key} data={item} user={user}/>
                ))}
            </div>

            <div className="chatWindow__emojiarea" style={{height: emojiOpen ? '200px': '0px' }}>
                <EmojiPicker 
                    onEmojiClick={handleEmojiClick}
                    disableSearchBar
                    disableSkinTonePicker
                />
            </div>

            <div className="chatWindow__footer">
                <div className="chatWindow__left">
                    <div className="btn" onClick={handleCloseEmoji} style={{width: emojiOpen ? 20:0 }}>
                        <CloseIcon style={{color: '#919191'}} />
                    </div>
                    <div className="btn" onClick={handleOpenEmoji}>
                        <EmojiEmotionsIcon style={{color: emojiOpen ? '#009688' : '#919191'}} />
                    </div>
                </div>
                <div className="chatWindow__input">
                    <input type="text" name="message_sender" placeholder="Digite uma mensagem..." value={text} onChange={e=>setText(e.target.value)} onKeyUp={handleInputKeyUp} />
                </div>
                <div className="chatWindow__right">
                    { text === '' &&
                        <div className="btn" onClick={handleMicClick}>
                            <MicIcon style={{color: listening ? '#126ece' : '#919191'}} />
                        </div>
                    }
                    { text !== '' &&
                        <div className="btn" onClick={handleSendClick}>
                            <SendIcon style={{color: '#919191'}} />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}