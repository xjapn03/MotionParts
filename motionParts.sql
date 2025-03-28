--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

    NEW.updated_at = CURRENT_TIMESTAMP;  -- Actualiza la fecha/hora

    RETURN NEW;

END;

$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    cart_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_price double precision,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    parent_id bigint
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: order_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_details (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL,
    subtotal double precision NOT NULL
);


ALTER TABLE public.order_details OWNER TO postgres;

--
-- Name: order_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_details_id_seq OWNER TO postgres;

--
-- Name: order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_details_id_seq OWNED BY public.order_details.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    user_id bigint,
    cart_id bigint NOT NULL,
    total double precision NOT NULL,
    status character varying(255) DEFAULT 'PENDING'::character varying NOT NULL,
    payment_method character varying(255),
    pickup_location character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    product_id bigint NOT NULL,
    category_id bigint NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.product_category ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    reference character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    price integer NOT NULL,
    stock integer NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now(),
    updated_at timestamp(6) without time zone DEFAULT now(),
    image_url character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: shopping_carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shopping_carts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT shopping_carts_status_check CHECK (((status)::text = ANY (ARRAY[('ACTIVE'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELLED'::character varying)::text])))
);


ALTER TABLE public.shopping_carts OWNER TO postgres;

--
-- Name: shopping_carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shopping_carts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shopping_carts_id_seq OWNER TO postgres;

--
-- Name: shopping_carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shopping_carts_id_seq OWNED BY public.shopping_carts.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: order_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public.order_details_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: shopping_carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts ALTER COLUMN id SET DEFAULT nextval('public.shopping_carts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cart_items (id, cart_id, product_id, quantity, unit_price, created_at, updated_at, total_price) VALUES (42, 1, 1, 2, 500000, '2025-03-25 11:08:59.921744', '2025-03-25 11:08:59.921744', 1000000);


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.category (id, name, description, parent_id) VALUES (1, 'Baterias', 'Baterias para automovil de diferentes tipos y marcas.', NULL);
INSERT INTO public.category (id, name, description, parent_id) VALUES (2, 'Alternadores', 'Generadores eléctricos para automóviles que recargan la batería y alimentan los sistemas eléctricos.', NULL);
INSERT INTO public.category (id, name, description, parent_id) VALUES (3, 'Bobinas de ignición', 'Componentes esenciales del sistema de encendido que transforman la corriente en alta tensión para las bujías.', NULL);
INSERT INTO public.category (id, name, description, parent_id) VALUES (4, 'Luces', 'Diferentes tipos de iluminación para vehículos, incluyendo faros, luces traseras y auxiliares.', NULL);
INSERT INTO public.category (id, name, description, parent_id) VALUES (5, 'Motores de arranque', 'Motores eléctricos diseñados para poner en marcha el motor de combustión interna del vehículo.', NULL);
INSERT INTO public.category (id, name, description, parent_id) VALUES (6, 'Reguladores', 'Dispositivos que controlan la tensión eléctrica del alternador para evitar sobrecargas en el sistema.', NULL);
INSERT INTO public.category (id, name, description, parent_id) VALUES (10, 'Bobinas completas línea', 'Bobinas en línea completas', 3);
INSERT INTO public.category (id, name, description, parent_id) VALUES (8, 'Bateria Caja grande', 'Batería de caja 1000-1100', 1);
INSERT INTO public.category (id, name, description, parent_id) VALUES (9, 'Alternador Tipo Valeo', 'Alternadores tipo Valeo original', 2);
INSERT INTO public.category (id, name, description, parent_id) VALUES (11, 'Luces LED altas', 'Luces LED', 4);
INSERT INTO public.category (id, name, description, parent_id) VALUES (12, 'Arranque Tipo Bosch', 'Motores de arranque tipo Bosch', 5);
INSERT INTO public.category (id, name, description, parent_id) VALUES (13, 'Regulador Bosch', 'Reguladores marca Bosch', 6);


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_category (product_id, category_id, id) VALUES (1, 1, 1);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (1, 8, 2);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (2, 2, 3);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (3, 2, 4);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (3, 9, 5);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (4, 3, 6);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (4, 10, 7);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (5, 3, 8);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (6, 4, 9);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (6, 11, 10);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (7, 4, 11);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (8, 5, 12);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (9, 5, 13);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (9, 12, 14);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (10, 6, 15);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (10, 13, 16);
INSERT INTO public.product_category (product_id, category_id, id) VALUES (11, 6, 17);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (1, '79836', 'Bateria Bosch', 'Caja 35/65 (BCI), D23 (JIS)', 500000, 5, '2025-03-10 21:48:23.217568', '2025-03-10 21:48:23.217568', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (2, '10001', 'Alternador Bosch 12V 90A', 'Alternador de alto rendimiento compatible con múltiples modelos de automóviles.', 750000, 10, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (3, '10002', 'Alternador Valeo 14V 120A', 'Alternador de alta eficiencia, ideal para vehículos con mayor demanda eléctrica.', 820000, 8, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (4, '20001', 'Bobina Bosch 0986JG', 'Bobina de encendido para motores de 4 cilindros, mejora el rendimiento del motor.', 150000, 15, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (5, '20002', 'Bobina Denso 6731306', 'Bobina de ignición de alta resistencia para sistemas electrónicos modernos.', 175000, 12, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (6, '30001', 'Faros LED H7 Philips', 'Luces delanteras LED de alto brillo y bajo consumo energético.', 220000, 20, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (7, '30002', 'Kit de luces Xenón 6000K', 'Iluminación blanca intensa para una mejor visibilidad nocturna.', 280000, 10, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (8, '40001', 'Motor de arranque Denso 2.2KW', 'Motor de arranque potente para vehículos de gasolina y diésel.', 680000, 5, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (9, '40002', 'Motor de arranque Bosch 1.8KW', 'Arrancador compacto y eficiente, compatible con varias marcas.', 720000, 6, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (10, '50001', 'Regulador de voltaje Bosch 14V', 'Regulador electrónico para alternadores de 14V.', 90000, 30, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);
INSERT INTO public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) VALUES (11, '50002', 'Regulador de voltaje Valeo 12V', 'Regulador confiable para alternadores de 12V, protege el sistema eléctrico.', 85000, 25, '2025-03-14 01:29:10.004605', '2025-03-14 01:29:10.004605', NULL);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles (id, name) VALUES (1, 'ADMIN');
INSERT INTO public.roles (id, name) VALUES (2, 'USER');
INSERT INTO public.roles (id, name) VALUES (3, 'EMPLEADO');


--
-- Data for Name: shopping_carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.shopping_carts (id, user_id, status, created_at, updated_at) VALUES (1, 1, 'ACTIVE', '2025-03-17 19:02:48.409567', '2025-03-17 19:02:48.409567');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO public.user_roles (user_id, role_id) VALUES (2, 2);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, username, email, password, created_at, updated_at) VALUES (1, 'juanperez', 'juan.perez@example.com', '$2a$12$.19iyV1u7ix26Rk1BIV/nuF37qAFHQ5YTYwegrCvehM1gGVxFGfBq', '2025-03-10 19:05:29.907813', '2025-03-10 19:05:29.907813');
INSERT INTO public.users (id, username, email, password, created_at, updated_at) VALUES (2, 'mariagonzalez', 'maria.gonzalez@example.com', '$2a$12$.19iyV1u7ix26Rk1BIV/nuF37qAFHQ5YTYwegrCvehM1gGVxFGfBq', '2025-03-10 19:05:29.907813', '2025-03-10 19:05:29.907813');
INSERT INTO public.users (id, username, email, password, created_at, updated_at) VALUES (3, 'carlosramirez', 'carlos.ramirez@example.com', 'sapo123', '2025-03-10 19:05:29.907813', '2025-03-10 19:05:29.907813');


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 42, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 13, true);


--
-- Name: order_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_details_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_category_id_seq', 17, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: shopping_carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shopping_carts_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (product_id, category_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_reference_key UNIQUE (reference);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: shopping_carts shopping_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts
    ADD CONSTRAINT shopping_carts_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users trigger_update_users; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.shopping_carts(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: category fk_category_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES public.category(id) ON DELETE SET NULL;


--
-- Name: order_details fk_order_details_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_details fk_order_details_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: orders fk_orders_cart; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_cart FOREIGN KEY (cart_id) REFERENCES public.shopping_carts(id) ON DELETE CASCADE;


--
-- Name: orders fk_orders_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: product_category product_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: product_category product_category_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: shopping_carts shopping_carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts
    ADD CONSTRAINT shopping_carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

