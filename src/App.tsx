import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import './index.scss';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { changeQuery, fetchContacts, setContactsType, setInitialState, setOnlyEven } from './store/contactsSlice';
import { selectContacts, selectHasMore, selectOnlyEven, selectQuery } from './store/selectors';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {
  return (
    <div style={{ height: '100vh' }} className={'d-flex justify-content-center align-items-center'}>
      <AllContactsButton />
      <USContactsButton />
    </div>
  );
}

const AllContactsButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button className={'m-1'} id={'button-a'} onClick={() => setShowModal(true)}>
        All Contacts
      </Button>
      <ContactsModal title={'All Contacts'} setShowModal={setShowModal} showModal={showModal} contactsType={'all'} />
    </>
  );
};

const USContactsButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button className={'m-1'} id={'button-b'} onClick={() => setShowModal(true)}>
        US Contacts
      </Button>
      <ContactsModal title={'US Contacts'} setShowModal={setShowModal} showModal={showModal} contactsType={'US'} />
    </>
  );
};

type ContactModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  title: string;
  contactsType: 'all' | 'US';
};

const ContactsModal = ({ title, showModal, setShowModal, contactsType }: ContactModalProps) => {
  const dispatch = useAppDispatch();
  const onlyEven = useAppSelector(selectOnlyEven);
  const contacts = useAppSelector(selectContacts);
  const query = useAppSelector(selectQuery);
  const hasMore = useAppSelector(selectHasMore);

  useEffect(() => {
    if (showModal) {
      dispatch(setContactsType(contactsType));
      dispatch(fetchContacts());
    }
    return () => {
      dispatch(setInitialState());
    };
  }, [showModal]);

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      id={'contacts-modal'}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <Form.Group controlId="query">
          <Form.Label>Search</Form.Label>
          <Form.Control
            placeholder="Search by name"
            value={query}
            onChange={(event) => dispatch(changeQuery(event.target.value))}
          />
        </Form.Group>
        <ListGroup id={'scrollableDiv'}>
          <InfiniteScroll
            scrollableTarget="scrollableDiv"
            dataLength={contacts.length}
            next={() => dispatch(fetchContacts())}
            hasMore={hasMore}
            loader={'Loading...'}
          >
            {contacts.map((contact) => (
              <Contact contact={contact} key={contact.id} />
            ))}
          </InfiniteScroll>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Form.Check
          checked={onlyEven}
          type={'checkbox'}
          label={'Only even'}
          onChange={(event) => {
            dispatch(setOnlyEven(event.target.checked));
          }}
        />
        <Button onClick={() => setShowModal(false)} id={'close-button'}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Contact = ({ contact }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ListGroup.Item key={contact.id} action onClick={() => setShowModal(true)}>
        <div style={{ backgroundColor: contact.color, width: 10, height: 10 }} className={'d-inline-block mr-3'}></div>
        <span>
          {contact.id} {contact.first_name} {contact.last_name}
        </span>
      </ListGroup.Item>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        size={'sm'}
        centered
      >
        <Modal.Header closeButton>Contact</Modal.Header>
        <Modal.Body>
          <div>
            <strong>First name:</strong> {contact.first_name}
          </div>
          <div>
            <strong>Last name:</strong> {contact.last_name}
          </div>
          <div>
            <strong>Phone:</strong> {contact.phone_number}
          </div>
          <div>
            <strong>Country ISO:</strong> {contact.country.iso}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default App;
