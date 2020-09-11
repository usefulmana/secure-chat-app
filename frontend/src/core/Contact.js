import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './Contact.scss';
import { login, authenticate, findUser } from '../API/userAPI';
import AddContact from './AddContact';
import Modal from '../Template/Modal';

const Contact = ({ visible }) => {
  var jwt = JSON.parse(localStorage.getItem('jwt'));

  const [formOpened, setFormOpened] = useState(false);

  useEffect(() => {}, []);

  const addContactButton = () => {
    return <button onClick={() => setFormOpened(true)}>Add contact</button>;
  };

  const modalStyle = {
    width: '50vw',
    height: '20vh',
  };

  return (
    visible === 'contact' && (
      <div>
        Contact
        {addContactButton()}
        <Modal
          opened={formOpened}
          setOpened={setFormOpened}
          options={modalStyle}
        >
          <AddContact />
        </Modal>
      </div>
    )
  );
};

export default Contact;
