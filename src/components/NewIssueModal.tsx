import React, { useState } from 'react';
// import Modal from 'react-modal';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.css';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_REPO_ID = gql`
  query GetRepoId($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      id
    }
  }
`;

const CREATE_ISSUE = gql`
  mutation CreateIssue($repositoryId: ID!, $title: String!, $body: String) {
    createIssue(input: { repositoryId: $repositoryId, title: $title, body: $body }) {
      issue {
        number
        title
        url
      }
    }
  }
`;

interface NewIssueModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  owner: string;
  repo: string;
  onIssueCreated: () => void;
}

const NewIssueModal: React.FC<NewIssueModalProps> = ({
  isOpen,
  onRequestClose,
  owner,
  repo,
  onIssueCreated,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const { data, loading, error } = useQuery(GET_REPO_ID, {
    variables: { owner, repo },
    skip: !isOpen,
  });

  const [createIssue, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_ISSUE, {
    onCompleted: () => {
      onIssueCreated();
      setTitle('');
      setBody('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data && data.repository.id) {
      createIssue({
        variables: {
          repositoryId: data.repository.id,
          title,
          body,
        },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Create New Issue" className="modal">
      <div className="modal-header">
        <h5 className="modal-title">Create New Issue</h5>
        <button type="button" className="close" onClick={onRequestClose}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="issueTitle">Title:</label>
            <input
              id="issueTitle"
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="issueBody">Body:</label>
            <textarea
              id="issueBody"
              className="form-control"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          {mutationLoading && <div className="alert alert-info">Creating issue...</div>}
          {mutationError && <div className="alert alert-danger">Error: {mutationError.message}</div>}
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button type="button" className="btn btn-secondary" onClick={onRequestClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewIssueModal;
