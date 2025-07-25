# HackClub CDN

A secure, fast, and reliable content delivery network and file manager built for Hack Clubbers built for students by students. Effortlessly upload, organize, and share your files and folders with advanced privacy controls, beautiful UI, and seamless integration with the Hack Club community.

---

## 🚀 Features

- **Modern Dashboard**: Intuitive, responsive UI for managing files and folders
- **File & Folder Management**: Upload, organize, rename, and delete files and folders
- **Drag & Drop Uploads**: Upload multiple files with progress tracking and notifications
- **Privacy Controls**: Share files/folders privately, with specific users, or publicly via link
- **Starred & Recent**: Quickly access starred and recently used files
- **Secure Authentication**: Login with Slack or email/password (with session refresh)
- **Rich Previews**: Image, video, and document previews
- **Activity & Stats**: Dashboard with usage stats and recent activity
- **API Integration**: Built-in API client for backend communication
- **Beautiful Design**: Tailwind CSS, custom themes, and delightful animations

---

## 📸 Screenshots

<!-- Add your screenshots here -->

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

---

## ⚙️ Configuration

- API endpoints are configured in [`src/consts.ts`](src/consts.ts). By default, API requests are proxied to `/api`.
- For authentication and file operations, ensure your backend implements the required endpoints (see [UploadWrapper.README.md](./UploadWrapper.README.md) for details).
- Environment variables can be set in `.env` if needed for custom API URLs.

---

## 📦 Usage

- **Login**: Use Slack or email/password to sign in.
- **Upload Files**: Drag & drop or use the upload button. Progress and errors are shown in real-time.
- **Organize**: Create folders, move files, and manage your content visually.
- **Share**: Share files/folders with others by email or generate a public link.
- **Star & Trash**: Star important files for quick access, or move items to trash.
- **Search & Filter**: Quickly find files by name, type, or tag.

For advanced upload and backend integration, see [`UploadWrapper.README.md`](./UploadWrapper.README.md).

---

## 🧰 Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (blazing fast dev/build)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first styling)
- [React Router](https://reactrouter.com/) (routing)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Toastify](https://fkhadra.github.io/react-toastify/) (notifications)
- [Axios](https://axios-http.com/) (API requests)

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit and push (`git commit -am 'Add new feature' && git push`)
5. Open a Pull Request

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Credits & Links

- Built by [Khaled Muhammad](mailto:khaledmuhmmed99@gmail.com) and the Hack Club community
- [GitHub Repo](https://github.com/khaled-muhammad/hackclub_cdn)
- [Hack Club](https://hackclub.com/)
- Inspired by the needs of student hackers everywhere!
