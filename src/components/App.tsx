import * as THREE from "three";
import { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { Button } from "semantic-ui-react";
import { Canvas, useFrame, extend, ReactThreeFiber } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { getRepos } from "../utils/githubData";
import langColors from "../utils/github-lang-colors.json";
import coords from "../utils/coords.json";
import SlideOutList from "./SlideOutList";
import ProjectPreviewModal from "./Modal";
import SocialList from "./SocialList";
import Heading from "./Heading";
import { ProjectNode, KeyData, ActiveRepo } from "../types";
import "../styles/App.css";

extend({ Line_: THREE.Line });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>;
    }
  }
}

function Node(props: ProjectNode) {
  const mesh = useRef<THREE.Mesh>(null!);
  const vec = new THREE.Vector3(props.x, props.y, props.z);
  const [hovered, setHover] = useState(false);
  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      scale={hovered ? 1.3 : 1}
      position={vec}
      ref={mesh}
      onClick={props.onClick}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={hovered ? "#1dcd34" : props.color} />
    </mesh>
  );
}

function Edge(props: { start: number[]; end: number[] }) {
  const ref = useRef<THREE.Line>(null!);

  useEffect(() => {
    ref.current.geometry.setFromPoints(
      [props.start, props.end].map((point) => new THREE.Vector3(...point))
    );
  }, [props.start, props.end]);

  return (
    <line_ ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="white" />
    </line_>
  );
}

export default function App() {
  const [repos, setRepos] = useState([]);
  const [colors, setColors] = useState([]);
  const [keyValues, setKeyValues] = useState<KeyData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRepo, setActiveRepo] = useState({} as ActiveRepo);

  // get repos and languages for a user
  useEffect(() => {
    (async () => {
      const allRepos = await getRepos("jleg13");
      // filter by repos that have a language and sort by created_at keeping only 20 newest
      const filteredRepos = allRepos.filter((repo: { language: null }) => {
        return repo.language !== null;
      });
      const sortedRepos = filteredRepos.sort(
        (a: { created_at: string }, b: { created_at: string }) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
      );
      const slicedRepos = sortedRepos.slice(0, 20);
      setRepos(slicedRepos);

      setColors(
        slicedRepos.map((repo: { language: string }) => {
          const color =
            langColors[repo.language as keyof typeof langColors] || "#000";
          return color;
        })
      );

      const uniqueLangs = slicedRepos
        .map((repo: { language: string }) => repo.language)
        .filter((value: string, index: number, self: string[]) => {
          return self.indexOf(value) === index;
        });

      const keyValues: KeyData[] = uniqueLangs.map((lang: string) => {
        const color = langColors[lang as keyof typeof langColors];
        return { label: lang, color };
      });
      setKeyValues(keyValues);
    })();
  }, []);

  return (
    <div className="App">
      <Heading heading="Joshua Le Gresley" subheading="Software Developer" />
      <CSSTransition
        classNames={"site-code-button-transition"}
        in={true}
        appear
        timeout={800}
      >
        <div className="site-code-button">
          <Button
            icon={"code"}
            size="huge"
            style={{ backgroundColor: "#686a63" }}
            onClick={() => {
              setModalOpen(true);
              setActiveRepo({
                name: "Portfolio-2022",
                branch: "main",
                url: "https://github.com/jleg13/Portfolio-2022",
              });
            }}
          />
        </div>
      </CSSTransition>
      <ProjectPreviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        activeRepo={activeRepo}
      />
      <SocialList
        data={[
          {
            icon: "linkedin",
            url: "https://www.linkedin.com/in/joshua-le-gresley/",
          },
          {
            icon: "github",
            url: "https://github.com/jleg13",
          },
          {
            icon: "at",
            url: "mailto:joshualegresley@gmail.com",
          },
          {
            icon: "globe",
            url: "https://www.joshualegresley.me",
          },
        ]}
      />
      <SlideOutList data={keyValues} />

      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {repos.map(
          (
            repo: { name: string; html_url: string; default_branch: string },
            index: number
          ) => {
            return (
              <Node
                {...{
                  ...coords.vertices[index],
                  color: colors[index],
                  index,
                  name: repo.name,
                  url: repo.html_url,
                  branch: repo.default_branch,
                  key: index,
                  onClick: () => {
                    setModalOpen(true);
                    setActiveRepo({
                      name: repo.name,
                      branch: repo.default_branch,
                      url: repo.html_url,
                    });
                  },
                }}
              />
            );
          }
        )}

        {coords.edges.map((edge: { from: number; to: number }) => {
          const source = coords.vertices[edge.from];
          const target = coords.vertices[edge.to];
          return (
            <Edge
              start={[source.x, source.y, source.z]}
              end={[target.x, target.y, target.z]}
              key={`${edge.from}-${edge.to}`}
            />
          );
        })}
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.8}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
