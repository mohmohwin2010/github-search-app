// src/components/NewIssueModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
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

  // Use the `useQuery` hook to fetch the repository ID
  const { data, loading, error } = useQuery(GET_REPO_ID, {
    variables: { owner, repo },
    skip: !isOpen, // Only run query if the modal is open
  });

  // Use the `useMutation` hook to create a new issue
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
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Create New Issue">
      <h2>Create New Issue</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        {mutationLoading && <p>Creating issue...</p>}
        {mutationError && <p>Error: {mutationError.message}</p>}
        <button type="submit">Submit</button>
        <button type="button" onClick={onRequestClose}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default NewIssueModal;
