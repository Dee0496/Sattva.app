import AIToolQuiz from "../components/AIToolQuiz"

export default function Home() {
  return (
    <div style={{padding:"40px",maxWidth:"900px",margin:"auto"}}>

      <h1>Best AI Tools To Make Money Online</h1>

      <p>
        Discover the best AI tools for creators, freelancers, students and businesses.
      </p>

      <AIToolQuiz/>

      <h2>Popular Guides</h2>

      <ul>

        <li>
          <a href="/jobs/best-ai-tools-for-bloggers">
          Best AI Tools for Bloggers
          </a>
        </li>

        <li>
          <a href="/jobs/best-ai-tools-for-teachers">
          Best AI Tools for Teachers
          </a>
        </li>

        <li>
          <a href="/jobs/best-ai-tools-for-marketers">
          Best AI Tools for Marketers
          </a>
        </li>

        <li>
          <a href="/directory">
          Top 100 AI Tools Directory
          </a>
        </li>

      </ul>

    </div>
  )
}
