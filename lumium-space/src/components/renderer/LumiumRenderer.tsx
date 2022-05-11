import { render_markdown } from 'lumium-renderer';
import { useEffect } from 'react';

const md = " # Formulary & Course Materials " +
    "  " +
    " This computer science wiki is hosted on [wiki.d3psi.net](http://wiki.d3psi.net). Insight into version history can be obtained from the downstream-only [GitHub repository](https://github.com/D3PSI/cs-wiki). Changes, comments and feedback may be emailed to [cschwyter@ethz.ch](mailto:cschwyter@ethz.ch). " +
    "  " +
    "     ## Discrete Mathematics - 252-0025-01L - HS21 " +
    "  " +
    "     --- " +
    "  " +
    "     [Resources and Materials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Resources%20and%20Materials%2055c1e4fc392e4ce88ab0c1ed27bd5812.csv) " +
    "  " +
    "     [Mathematical Reasoning, Proofs, and a First Approach to Logic](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Mathematical%20Reasoning,%20Proofs,%20and%20a%20First%20Approa%20d1206e601cf04e00bef78613383232cc.md) " +
    "  " +
    "     [Sets, Relations, and Functions](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Sets,%20Relations,%20and%20Functions%2010ee6209ddc64b6d8356a7f3e4fef13b.md) " +
    "  " +
    "     [Number Theory](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Number%20Theory%20ad0a4316ced643309f86e5e2aa2b6c61.md) " +
    "  " +
    "     [Algebra](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Algebra%202e542e6a0045446282bf640875624025.md) " +
    "  " +
    "     [Logic](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Logic%20be320d1ae5984d0b85fd2f8c7af71ee5.md) " +
    "  " +
    "     [Diffie-Hellman Key-Agreement](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Number%20Theory%20ad0a4316ced643309f86e5e2aa2b6c61/Diffie-Hellman%20Key-Agreement%20075c2667b7ac486fb6e351f38a05f071.md) " +
    "  " +
    "     [RSA Public-Key Encryption](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Algebra%202e542e6a0045446282bf640875624025/RSA%20Public-Key%20Encryption%20ba2412b552a64e948d364c0c840465f2.md) " +
    "  " +
    "     [Lagrange Interpolation of Polynomials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Algebra%202e542e6a0045446282bf640875624025/Lagrange%20Interpolation%20of%20Polynomials%20e3d16eff64924159afabc54390c2ab4b.md) " +
    "  " +
    "     [Error-Correcting Codes](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Algebra%202e542e6a0045446282bf640875624025/Error-Correcting%20Codes%20aa558ef053084f5596687ccf8fb23452.md) " +
    "  " +
    "     [Linear-Feedback Shift Registers (LFSRs) (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Algebra%202e542e6a0045446282bf640875624025/Linear-Feedback%20Shift%20Registers%20(LFSRs)%20(TODO)%20197dbfdf123a4fe381b910d544e22a75.md) " +
    "  " +
    "     [Extended Euclidean Algorithm (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Algebra%202e542e6a0045446282bf640875624025/Extended%20Euclidean%20Algorithm%20(TODO)%20edc946a25db240aabd27314bf3d9481c.md) " +
    "  " +
    "     ## Algorithms and Datastructures - 252-0026-00L - HS21 " +
    "  " +
    "     --- " +
    "  " +
    "     [Resources and Materials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Resources%20and%20Materials%207dd519d2941b44f8bfac6c48abb4a2c1.csv) " +
    "  " +
    "     [Big-O-/Asymptotic-Notation, Landau-Symbols](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Big-O-%20Asymptotic-Notation,%20Landau-Symbols%20153cd914ca0f4c37b1785816b28c6f81.md) " +
    "  " +
    "     [Data Structures and Abstract Data Types (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Data%20Structures%20and%20Abstract%20Data%20Types%20(TODO)%20edd5e27c69cd4826bbe7fc90165cb528.md) " +
    "  " +
    "     [Divide-and-Conquer Algorithms](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Divide-and-Conquer%20Algorithms%202967e180f0f845259a057896a47d5a9c.md) " +
    "  " +
    "     [Searching](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Searching%20591cad76b9e4428d8bf64e5ec3027863.md) " +
    "  " +
    "     [Sorting](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Sorting%206fa854f82baf4008b07886c458a0a9b5.md) " +
    "  " +
    "     [Multiplication (Integer & Matrix Multiplication)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Multiplication%20(Integer%20&%20Matrix%20Multiplication)%2065169333eb2f486782e11bf4df1fa1f4.md) " +
    "  " +
    "     [Dynamic Programming](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Dynamic%20Programming%200593d64901ca490ea11a32d06096a0c2.md) " +
    "  " +
    "     [Graphs](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Graphs%20f8a1f5321e374c5cae7e05e6cecaacd6.md) " +
    "  " +
    "     [Shortest Paths](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Shortest%20Paths%2057d9ca620d3e46ca94e34f2bd590c043.md) " +
    "  " +
    "     [Minimum Spanning Trees (MSTs)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Minimum%20Spanning%20Trees%20(MSTs)%2053ceee940e2c4adda36511b789c93892.md) " +
    "  " +
    "     [Selection Problem (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Selection%20Problem%20(TODO)%20c176968ea8ed4fefb234f74839f73111.md) " +
    "  " +
    "     [Combinatorics (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Combinatorics%20(TODO)%20a6f920864f3f484c8eaabb0a8f81f97f.md) " +
    "  " +
    "     ## Introduction to Programming - 252-0027-00L - HS21 " +
    "  " +
    "     --- " +
    "  " +
    "     [Resources and Materials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Resources%20and%20Materials%203f1d27183c074aa68a6b7c8e8ebe3f8c.csv) " +
    "  " +
    "     [Extended Backus-Naur Form (EBNF)-Descriptions](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Extended%20Backus-Naur%20Form%20(EBNF)-Descriptions%20608dc7f653c9470cad3ee3791f5a0c9a.md) " +
    "  " +
    "     [Hoare-Logic](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Hoare-Logic%2008c60b02ccd04c31acdffa543ae436e0.md) " +
    "  " +
    "     ## Linear Algebra - 401-0131-00L - HS21 " +
    "  " +
    "     --- " +
    "  " +
    "     [Resources and Materials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Resources%20and%20Materials%2092a1418c784f40f681d5800a7cf9153b.csv) " +
    "  " +
    "     [Complex Numbers (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Complex%20Numbers%20(TODO)%2019ce2598b4404fb0a7c0f7d068f509f5.md) " +
    "  " +
    "     [Linear Systems, Gaussian Elimination (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Linear%20Systems,%20Gaussian%20Elimination%20(TODO)%20bbcc864bbb3648d8acf4af6c1c5736ee.md) " +
    "  " +
    "     [Matrices and Vectors (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Matrices%20and%20Vectors%20(TODO)%201a8c5a71f5c142fba7b742fd01c48f7e.md) " +
    "  " +
    "     [Vectorspaces, Subspaces, Basis (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Vectorspaces,%20Subspaces,%20Basis%20(TODO)%207fb71435e3154ad8ac3b6155c301ab19.md) " +
    "  " +
    "     [Linear Transformations (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Linear%20Transformations%20(TODO)%205939a77300204e44b9e97c3ba57be72a.md) " +
    "  " +
    "     [Orthogonal/Unitary Transformations (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Orthogonal%20Unitary%20Transformations%20(TODO)%203c58f317f040422b85497e4fb49216e7.md) " +
    "  " +
    "     [Linear Least Squares (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Linear%20Least%20Squares%20(TODO)%20ee88b98de66f420ea550152aa9b53840.md) " +
    "  " +
    "     ## Digital Design and Computer Architecture - **252-0028-00L - FS22** " +
    "  " +
    "     --- " +
    "  " +
    "     [Resources and Materials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Resources%20and%20Materials%20e4f94fe461eb427b8785490485b484a1.csv) " +
    "  " +
    "     ## Parallel Programming - **252-0029-00L - FS22** " +
    "  " +
    "     --- " +
    "  " +
    "     [Resources and Materials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Resources%20and%20Materials%20e3a84a83032e4162814db37835d1a03d.csv) " +
    "  " +
    "     [Terminology](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Terminology%20d6d11824b4394bb29a92196251f55a1d.csv) " +
    "  " +
    "     [JVM Overview](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/JVM%20Overview%20de9c8b74bfad45ef89d5619aaaa285eb.md) " +
    "  " +
    "     [Java Recap (in light of concurrency)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Java%20Recap%20(in%20light%20of%20concurrency)%20bfe2f6b7b8b047b48e7f4f33b1ed0f81.md) " +
    "  " +
    "     [Threads and Synchronization](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Threads%20and%20Synchronization%208eed6a728f094eb6ab3696275989e0c2.md) " +
    "  " +
    "     [Parallel Architectures](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Parallel%20Architectures%20f17dc1d4bf6b49a3996a6560066529ad.md) " +
    "  " +
    "     [Basic Concepts in Parallelism](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Basic%20Concepts%20in%20Parallelism%2059fb3917cfd1426cb20db9e374d5da4f.md) " +
    "  " +
    "     [Divide-and-Conquer, Cilk-Style Bounds](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Divide-and-Conquer,%20Cilk-Style%20Bounds%20f9d22e757a5e41249e50e4ec0186c10d.md) " +
    "  " +
    "     [ForkJoin Framwork - Shared Memory Concurrency, Locks, Data Races](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/ForkJoin%20Framwork%20-%20Shared%20Memory%20Concurrency,%20Loc%206f251dfd9bf24720acfa816286446268.md) " +
    "  " +
    "     [Locks using Atomic Registers](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Locks%20using%20Atomic%20Registers%20927248627b8e45f6b36f4f3c5c156392.md) " +
    "  " +
    "     [Spinlocks, Deadlocks, Semaphores](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Spinlocks,%20Deadlocks,%20Semaphores%2051bef3e37b554375b1603db09778beb5.md) " +
    "  " +
    "     [Barrier, Producer-/Consumer, Monitors](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Barrier,%20Producer-%20Consumer,%20Monitors%20ddcd7501a3b344d1bf9613eaca66789a.md) " +
    "  " +
    "     [Readers/Writers Lock, Lock Granularity: Coarse Grained, Fine Grained, Optimal and Lazy Synchronization](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Readers%20Writers%20Lock,%20Lock%20Granularity%20Coarse%20Grai%2049c5760163b5434f9f0f69b1a611c3c2.md) " +
    "  " +
    "     [Without Locks](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Without%20Locks%200ec49316493648a0a83d353277f8adea.md) " +
    "  " +
    "     [ABA Problem, Concurrency Theory](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/ABA%20Problem,%20Concurrency%20Theory%202e7e8d2d8fc64feba7b3b04ddfab2255.md) " +
    "  " +
    "     [Sequential Consistency, Consensus, Transactional Memory, Message Passing](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Sequential%20Consistency,%20Consensus,%20Transactional%20M%20468db7b5321e4b54b6b4307c42d82227.md) " +
    "  " +
    "     [Consensus Proof and Reductions](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Consensus%20Proof%20and%20Reductions%20bfa857a267ac4e6aba4f4228a20ce239.md) " +
    "  " +
    "     [Parallel Sorting](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Parallel%20Sorting%20e422e3eea40e492a9f3fe4cfd0b5b65e.md) " +
    "  " +
    "     ## Algorithms and Probability - **252-0030-00L** - FS22 " +
    "  " +
    "     --- " +
    "  " +
    "     [Resources and Materials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Resources%20and%20Materials%20f8f787015ebd4dcd8a826d3008242916.csv) " +
    "  " +
    "     [Graphs (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Graphs%20(TODO)%20b149fa35dff041fb8a659592d3f9c6bd.md) " +
    "  " +
    "     [Probability Theory](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Probability%20Theory%20db98499109bd4c6f934431bfc46e9c17.md) " +
    "  " +
    "     [Randomized Algorithms](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Randomized%20Algorithms%20f5e5c1c9d8db4aedbdec1fba2421751a.md) " +
    "  " +
    "     [Sorting and Selecting](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Sorting%20and%20Selecting%202b7f52e90ad64c56b49053b5666629ef.md) " +
    "  " +
    "     [Primality Test (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Primality%20Test%20(TODO)%20326ba41e7d824799831ee8bfb74059e0.md) " +
    "  " +
    "     [Target-Shooting (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Target-Shooting%20(TODO)%20d5c89b39fda645e0a6872bd65a9ed1bb.md) " +
    "  " +
    "     [Finding Duplicates (TODO)](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Finding%20Duplicates%20(TODO)%2038ce05d0c51f46ab9a51823a426b8d70.md) " +
    "  " +
    "     [Hamiltonian Cycle in a Hypercube: Gray-Code](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Graphs%20(TODO)%20b149fa35dff041fb8a659592d3f9c6bd/Hamiltonian%20Cycle%20in%20a%20Hypercube%20Gray-Code%201e5ecb970a794ec7baa9a405b7023363.md) " +
    "  " +
    "     [Coupon-Collector Problem](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Probability%20Theory%20db98499109bd4c6f934431bfc46e9c17/Coupon-Collector%20Problem%208b5e0f9e298643c98675b803b7c39005.md) " +
    "  " +
    "     ## Analysis I - **401-0212-16L - FS22** " +
    "  " +
    "     --- " +
    "  " +
    "     [Resources and Materials](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Resources%20and%20Materials%207c54e79c3ea641649236661a9bf797bd.csv) " +
    "  " +
    "     [Real Numbers, Euclidean Domains, Complex Numbers](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Real%20Numbers,%20Euclidean%20Domains,%20Complex%20Numbers%20d4e5eeda077245d39c649f8cf57a2936.md) " +
    "  " +
    "     [Sequences and Series](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Sequences%20and%20Series%208a981a9ce10e4dfb82e989be6760ed05.md) " +
    "  " +
    "     [*Continuous Functions (TODO)*](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Continuous%20Functions%20(TODO)%209465b36198f3482bae0b551afdc5cf01.md) " +
    "  " +
    "     [Cauchy-Product of the Exponential Function](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Sequences%20and%20Series%208a981a9ce10e4dfb82e989be6760ed05/Cauchy-Product%20of%20the%20Exponential%20Function%209768354a1fa247a2aff9ab665de61605.md) " +
    "  " +
    "     [Coupon-Collector Problem](Formulary%20&%20Course%20Materials%20677618886e9347f58deaf01d94bc40d7/Probability%20Theory%20db98499109bd4c6f934431bfc46e9c17/Coupon-Collector%20Problem%208b5e0f9e298643c98675b803b7c39005.md) " +
    "  ";

export const LumiumRenderer = () => {
    useEffect(() => render_markdown(md));
    return null;
};
