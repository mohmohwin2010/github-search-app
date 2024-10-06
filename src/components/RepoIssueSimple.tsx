// src/components/RepoIssues.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import IssueList from './IssueList';
import NewIssueModal from './NewIssueModal';

const GET_REPO_ISSUES = gql`
  query GetRepoIssues($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      issues(states: OPEN, first: 20) {
        edges {
          node {
            title
            number
            url
            createdAt
            author {
              login
            }
          }
        }
      }
    }
  }
`;

const RepoIssuesSimple: React.FC = () => {
  const { username, reponame } = useParams<{ username?: string; reponame?: string }>();
  const { loading, error, data, refetch } = useQuery(GET_REPO_ISSUES, {
    variables: { owner: username!, repo: reponame! },
    skip: !username || !reponame,
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (!username || !reponame) {
    return <p>Invalid repository details.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Open Issues for {reponame}</h2>
      <button onClick={() => setIsModalOpen(true)}>Create New Issue</button>
      <IssueList issues={data.repository.issues.edges} />
      <NewIssueModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        owner={username}
        repo={reponame}
        onIssueCreated={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default RepoIssuesSimple;
