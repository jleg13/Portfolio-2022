import * as THREE from "three";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "semantic-ui-react";
import { Canvas, useFrame, extend, ReactThreeFiber } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { getRepos } from "../utils/githubData";
import langColors from "../utils/github-lang-colors.json";
import coords from "../coords.json";
import SlideOutList from "./SlideOutList";
import ProjectPreviewModal from "./Modal";
import SocialList from "./SocialList";
import { ProjectNode, KeyData } from "../types";
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
      scale={hovered ? 1.2 : 1}
      position={vec}
      ref={mesh}
      onClick={(e) => window.open(props.url, "_blank")}
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

  // get repos and languages for a user
  useEffect(() => {
    (async () => {
      const allRepos = await getRepos("jleg13");

      const filteredRepos = allRepos.filter((repo: { language: null }) => {
        return repo.language !== null;
      });
      setRepos(filteredRepos);

      setColors(
        filteredRepos.map((repo: { language: string }) => {
          const color =
            langColors[repo.language as keyof typeof langColors] || "#000";
          return color;
        })
      );

      const uniqueLangs = filteredRepos
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
      <div className="site-code-button">
        <Button
          icon={"code"}
          size="huge"
          style={{ backgroundColor: "#686a63" }}
          onClick={() => setModalOpen(true)}
        />
      </div>
      <ProjectPreviewModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
      <div className="heading">
        <h1>Joshua Le Gresley</h1>
        <h2>Software Engineer</h2>
      </div>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {repos.map(
          (repo: { name: string; html_url: string }, index: number) => {
            return (
              <Node
                {...{
                  ...coords.vertices[index],
                  color: colors[index],
                  index,
                  name: repo.name,
                  url: repo.html_url,
                  key: index,
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
