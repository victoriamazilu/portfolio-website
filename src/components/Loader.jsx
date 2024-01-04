import { Html } from '@react-three/drei';

const Loader = () => {
  return (
    <Html>
      <div className="flex justify-center items-center w-full h-full absolute">
        <div>
          <div className="loader">
            <div className="inner-loader"></div>
          </div>
          <h1 className="text-poppins text-semibold text-center mt-4 text-slate-600">Loading...</h1>
        </div>
      </div>
      <style>{`
        .loader {
          width: 80px;
          height: 80px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #3486eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .inner-loader {
          width: 100%;
          height: 100%;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #34bdeb;
          border-radius: 50%;
          animation: spin 1.5s linear reverse infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Html>
  );
};

export default Loader;
